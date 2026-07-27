import { create as createWppConnect, type Whatsapp as WppConnectWhatsapp } from '@wppconnect-team/wppconnect';
import { prisma } from '../../../config/database';
import { log } from '../../../config/logger';

type RuntimeClient = WppConnectWhatsapp & {
  close?: () => Promise<unknown>;
  onStateChange?: (callback: (state: unknown) => void) => { dispose: () => void };
  onMessage?: (callback: (message: unknown) => void) => { dispose: () => void };
  onNotificationMessage?: (callback: (message: unknown) => void) => { dispose: () => void };
  onPresenceChanged?: (callback: (presence: unknown) => void) => { dispose: () => void };
  onAck?: (callback: (ack: unknown) => void) => { dispose: () => void };
  onAddedToGroup?: (callback: (event: unknown) => void) => { dispose: () => void };
  onParticipantsChanged?: (callback: (event: unknown) => void) => { dispose: () => void };
  sendText?: (to: string, content: string) => Promise<unknown>;
  sendFile?: (to: string, pathOrBase64: string, options?: Record<string, unknown>) => Promise<unknown>;
  getAllChats?: (withNewMessageOnly?: boolean) => Promise<unknown[]>;
  getAllContacts?: () => Promise<unknown[]>;
  getAllGroups?: (withNewMessagesOnly?: boolean) => Promise<unknown[]>;
  getMessages?: (chatId: string, params?: Record<string, unknown>) => Promise<unknown[]>;
  getSessionTokenBrowser?: () => Promise<unknown>;
};

type SessionSnapshot = {
  sessionKey: string;
  status: string;
  qrCodeUrl?: string | null;
  phoneNumber?: string | null;
  lastConnectedAt?: Date | null;
  lastSeenAt?: Date | null;
  lastError?: string | null;
};

type Disposer = { dispose: () => void };

export class WhatsAppRuntimeService {
  private clients = new Map<string, RuntimeClient>();
  private sessions = new Map<string, SessionSnapshot>();
  private disposers = new Map<string, Disposer[]>();
  private reconnectAttempts = new Map<string, number>();
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelayMs = 5000;

  async startSession(sessionKey: string): Promise<{ sessionKey: string; status: string }> {
    await this.stopSession(sessionKey).catch(() => undefined);

    try {
      const client = (await createWppConnect({
        session: sessionKey,
        headless: true,
        logQR: false,
        autoClose: 0,
        statusFind: async (status: string) => {
          await this.updateSessionState(sessionKey, { status: this.normalizeStatus(status) });
        },
        catchQR: async (qrCode: string) => {
          await this.updateSessionState(sessionKey, { status: 'QR_READY', qrCodeUrl: qrCode, lastError: null });
        },
      })) as RuntimeClient;

      const disposers: Disposer[] = [];

      const stateChangeHandler = client.onStateChange?.((state: unknown) => {
        void this.updateSessionState(sessionKey, { status: this.normalizeStatus(String(state)) });
      });
      if (stateChangeHandler) disposers.push(stateChangeHandler);

      const messageHandler = client.onMessage?.((message: unknown) => {
        void this.handleIncomingMessage(sessionKey, message);
      });
      if (messageHandler) disposers.push(messageHandler);

      const notificationHandler = client.onNotificationMessage?.((message: unknown) => {
        void this.recordEvent(sessionKey, 'NOTIFICATION_MESSAGE', message);
      });
      if (notificationHandler) disposers.push(notificationHandler);

      const presenceHandler = client.onPresenceChanged?.((presence: unknown) => {
        void this.handlePresenceChange(sessionKey, presence);
      });
      if (presenceHandler) disposers.push(presenceHandler);

      const ackHandler = client.onAck?.((ack: unknown) => {
        void this.handleAck(sessionKey, ack);
      });
      if (ackHandler) disposers.push(ackHandler);

      const addedToGroupHandler = client.onAddedToGroup?.((event: unknown) => {
        void this.recordEvent(sessionKey, 'GROUP_SYNCED', event);
      });
      if (addedToGroupHandler) disposers.push(addedToGroupHandler);

      const participantsChangedHandler = client.onParticipantsChanged?.((event: unknown) => {
        void this.recordEvent(sessionKey, 'GROUP_SYNCED', event);
      });
      if (participantsChangedHandler) disposers.push(participantsChangedHandler);

      this.disposers.set(sessionKey, disposers);
      this.clients.set(sessionKey, client);
      this.reconnectAttempts.delete(sessionKey);

      await this.updateSessionState(sessionKey, { status: 'STARTING' });
      return { sessionKey, status: 'STARTING' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unable to start session';
      await this.updateSessionState(sessionKey, { status: 'ERROR', lastError: errorMessage });
      log.error('Failed to start WhatsApp session', { sessionKey, error: errorMessage });
      return { sessionKey, status: 'ERROR' };
    }
  }

  async stopSession(sessionKey: string): Promise<void> {
    const client = this.clients.get(sessionKey);
    if (client) {
      await client.close?.().catch(() => undefined);
      this.clients.delete(sessionKey);
    }

    const disposers = this.disposers.get(sessionKey);
    if (disposers) {
      for (const d of disposers) {
        d.dispose();
      }
      this.disposers.delete(sessionKey);
    }

    this.sessions.delete(sessionKey);
    this.reconnectAttempts.delete(sessionKey);

    await this.updateSessionState(sessionKey, { status: 'DISCONNECTED', qrCodeUrl: null, lastError: null }).catch(() => undefined);
  }

  async restartSession(sessionKey: string): Promise<{ sessionKey: string; status: string }> {
    await this.stopSession(sessionKey);
    return this.startSession(sessionKey);
  }

  async recoverSession(sessionKey: string): Promise<{ sessionKey: string; status: string }> {
    const sessionRecord = await prisma.whatsAppSession.findFirst({
      where: { sessionKey },
      select: { status: true, sessionKey: true },
    });

    if (!sessionRecord) {
      return { sessionKey, status: 'DISCONNECTED' };
    }

    if (sessionRecord.status === 'CONNECTED' || sessionRecord.status === 'QR_READY') {
      return this.startSession(sessionKey);
    }

    return { sessionKey, status: sessionRecord.status };
  }

  async getQRCode(sessionKey: string): Promise<string | null> {
    const snapshot = this.sessions.get(sessionKey);
    if (snapshot?.qrCodeUrl) {
      return snapshot.qrCodeUrl;
    }

    const record = await prisma.whatsAppSession.findFirst({
      where: { sessionKey },
      select: { qrCodeUrl: true },
    });

    return record?.qrCodeUrl ?? null;
  }

  async getStatus(sessionKey: string): Promise<{ sessionKey: string; status: string }> {
    const snapshot = this.sessions.get(sessionKey);
    if (snapshot) {
      return { sessionKey, status: snapshot.status };
    }

    const record = await prisma.whatsAppSession.findFirst({
      where: { sessionKey },
      select: { status: true },
    });

    return { sessionKey, status: record?.status ?? 'DISCONNECTED' };
  }

  async sendMessage(sessionKey: string, to: string, content: string): Promise<{ ok: boolean; error?: string; messageId?: string }> {
    const client = this.clients.get(sessionKey);
    if (!client?.sendText) {
      return { ok: false, error: 'Session not ready' };
    }

    const chatId = this.normalizeContactId(to);
    try {
      const result = await client.sendText(chatId, content) as { id?: string } | string | unknown;
      const messageId = typeof result === 'object' && result !== null && 'id' in result ? String(result.id) : undefined;

      void this.persistOutgoingMessage(sessionKey, chatId, content, messageId);

      return { ok: true, messageId };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to send message' };
    }
  }

  async sendMedia(sessionKey: string, to: string, filePath: string): Promise<{ ok: boolean; error?: string; messageId?: string }> {
    const client = this.clients.get(sessionKey);
    if (!client?.sendFile) {
      return { ok: false, error: 'Session not ready' };
    }

    const chatId = this.normalizeContactId(to);
    try {
      const result = await client.sendFile(chatId, filePath, { caption: 'Shared from OnePlace Enterprise' }) as { id?: string } | string | unknown;
      const messageId = typeof result === 'object' && result !== null && 'id' in result ? String(result.id) : undefined;

      void this.persistOutgoingMessage(sessionKey, chatId, '[Media]', messageId, 'image');

      return { ok: true, messageId };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to send media' };
    }
  }

  async listChats(sessionKey: string): Promise<unknown[]> {
    const client = this.clients.get(sessionKey);
    if (!client?.getAllChats) {
      return [];
    }

    const chats = (await client.getAllChats(false)) ?? [];
    void this.syncChatsToPrisma(sessionKey, chats);
    return chats;
  }

  async listContacts(sessionKey: string): Promise<unknown[]> {
    const client = this.clients.get(sessionKey);
    if (!client?.getAllContacts) {
      return [];
    }

    const contacts = (await client.getAllContacts()) ?? [];
    void this.syncContactsToPrisma(sessionKey, contacts);
    return contacts;
  }

  async listGroups(sessionKey: string): Promise<unknown[]> {
    const client = this.clients.get(sessionKey);
    if (!client?.getAllGroups) {
      return [];
    }

    const groups = (await client.getAllGroups(false)) ?? [];
    void this.syncGroupsToPrisma(sessionKey, groups);
    return groups;
  }

  async getMessages(sessionKey: string, chatId: string, limit = 50): Promise<unknown[]> {
    const client = this.clients.get(sessionKey);
    if (!client?.getMessages) {
      return [];
    }

    const messages = (await client.getMessages(chatId, { limit })) ?? [];
    void this.persistMessagesFromChat(sessionKey, chatId, messages);
    return messages;
  }

  async getSessionToken(sessionKey: string): Promise<unknown | null> {
    const client = this.clients.get(sessionKey);
    if (!client?.getSessionTokenBrowser) {
      return null;
    }

    return client.getSessionTokenBrowser().catch(() => null);
  }

  async logout(sessionKey: string): Promise<void> {
    const client = this.clients.get(sessionKey);
    if (client) {
      try {
        await client.logout?.();
      } catch {
        await client.close?.().catch(() => undefined);
      }
    }
    await this.stopSession(sessionKey);
  }

  private normalizeContactId(recipient: string): string {
    if (!recipient.includes('@')) {
      return `${recipient}@c.us`;
    }
    return recipient;
  }

  private normalizeStatus(rawStatus: string): string {
    const normalized = rawStatus.toUpperCase().replace(/\s+/g, '_');

    if (normalized.includes('CONNECTED') || normalized.includes('INCHAT') || normalized.includes('ISLOGGED')) {
      return 'CONNECTED';
    }
    if (normalized.includes('QRCODE') || normalized.includes('QR') || normalized.includes('QRREAD')) {
      return 'QR_READY';
    }
    if (normalized.includes('PAIR') || normalized.includes('AUTH') || normalized.includes('LOADING') || normalized.includes('START')) {
      return 'CONNECTING';
    }
    if (normalized.includes('DISCONNECT') || normalized.includes('CLOSE') || normalized.includes('UNPAIRED')) {
      return 'DISCONNECTED';
    }
    if (normalized.includes('RECONNECT')) {
      return 'RECONNECTING';
    }

    return normalized || 'DISCONNECTED';
  }

  private async updateSessionState(sessionKey: string, updates: Partial<SessionSnapshot>): Promise<void> {
    const previous = this.sessions.get(sessionKey) ?? { sessionKey, status: 'DISCONNECTED' };
    const next = { ...previous, ...updates, sessionKey } as SessionSnapshot;
    this.sessions.set(sessionKey, next);

    const now = new Date();
    const isNowConnected = next.status === 'CONNECTED';

    await prisma.whatsAppSession.updateMany({
      where: { sessionKey },
      data: {
        status: next.status as never,
        qrCodeUrl: next.qrCodeUrl ?? null,
        phoneNumber: next.phoneNumber ?? null,
        lastError: next.lastError ?? null,
        lastConnectedAt: isNowConnected ? now : next.lastConnectedAt ?? null,
        lastSeenAt: now,
      },
    }).catch(() => undefined);

    if (next.status === 'DISCONNECTED' && !this.reconnectAttempts.has(sessionKey)) {
      void this.scheduleReconnect(sessionKey);
    }
  }

  private async scheduleReconnect(sessionKey: string): Promise<void> {
    const attempts = this.reconnectAttempts.get(sessionKey) ?? 0;
    if (attempts >= this.maxReconnectAttempts) {
      log.warn('Max reconnect attempts reached for WhatsApp session', { sessionKey, attempts });
      return;
    }

    this.reconnectAttempts.set(sessionKey, attempts + 1);
    const delay = this.reconnectDelayMs * (attempts + 1);

    log.info('Scheduling WhatsApp reconnect', { sessionKey, attempt: attempts + 1, delay });

    setTimeout(() => {
      const stillDisconnected = this.sessions.get(sessionKey)?.status === 'DISCONNECTED';
      if (stillDisconnected) {
        void this.startSession(sessionKey);
      }
    }, delay);
  }

  private async getSessionRecord(sessionKey: string): Promise<{ id: string; organizationId: string } | null> {
    return prisma.whatsAppSession.findFirst({
      where: { sessionKey },
      select: { id: true, organizationId: true },
    }).catch(() => null);
  }

  private async handleIncomingMessage(sessionKey: string, message: unknown): Promise<void> {
    const msg = message as Record<string, unknown>;
    const externalId = String(msg.id ?? msg.messageId ?? '');
    const from = String(msg.from ?? '');
    const body = String(msg.body ?? msg.content ?? '');
    const messageType = String(msg.type ?? 'text');

    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    const contactPhone = this.extractPhoneFromId(from);
    const chatId = from;

    let contact = await prisma.whatsAppContact.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalContactId: contactPhone },
      select: { id: true },
    }).catch(() => null);

    if (!contact) {
      contact = await prisma.whatsAppContact.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalContactId: contactPhone,
          name: String(msg.fromMe ? 'Me' : msg.senderName ?? msg.pushName ?? contactPhone),
          phoneNumber: contactPhone,
        },
      }).catch(() => null);
    }

    let chat = await prisma.whatsAppChat.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalChatId: chatId },
      select: { id: true },
    }).catch(() => null);

    if (!chat) {
      chat = await prisma.whatsAppChat.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalChatId: chatId,
          chatType: 'individual',
        },
      }).catch(() => null);
    }

    await prisma.whatsAppMessage.create({
      data: {
        whatsappSessionId: sessionRecord.id,
        chatId: chat?.id ?? null,
        contactId: contact?.id ?? null,
        externalMessageId: externalId,
        direction: 'INCOMING',
        messageType,
        content: body,
        status: 'DELIVERED',
        sentAt: new Date(),
      },
    }).catch(() => undefined);

    await this.recordEvent(sessionKey, 'MESSAGE_RECEIVED', message);
  }

  private async handlePresenceChange(sessionKey: string, presence: unknown): Promise<void> {
    const pres = presence as Record<string, unknown>;
    const contactId = String(pres.id ?? pres.wid ?? '');
    const contactPhone = this.extractPhoneFromId(contactId);

    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    await prisma.whatsAppContact.upsert({
      where: { whatsappSessionId_externalContactId: { whatsappSessionId: sessionRecord.id, externalContactId: contactPhone } },
      update: { name: String(pres.name ?? pres.pushName ?? contactPhone) },
      create: {
        whatsappSessionId: sessionRecord.id,
        externalContactId: contactPhone,
        name: String(pres.name ?? pres.pushName ?? contactPhone),
        phoneNumber: contactPhone,
      },
    }).catch(() => undefined);

    await this.recordEvent(sessionKey, 'PRESENCE_UPDATED', presence);
  }

  private async handleAck(sessionKey: string, ack: unknown): Promise<void> {
    const ackData = ack as Record<string, unknown>;
    const externalMessageId = String(ackData.id ?? ackData.messageId ?? '');
    const ackType = String(ackData.type ?? ackData.ack ?? 'sent');

    let status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
    if (ackType.includes('read') || ackType.includes('4')) {
      status = 'READ';
    } else if (ackType.includes('deliver') || ackType.includes('3')) {
      status = 'DELIVERED';
    } else if (ackType.includes('sent') || ackType.includes('2') || ackType.includes('1')) {
      status = 'SENT';
    } else {
      status = 'FAILED';
    }

    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    const updateData: Record<string, unknown> = { status: status as never };
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }
    if (status === 'READ') {
      updateData.readAt = new Date();
    }

    await prisma.whatsAppMessage.updateMany({
      where: { whatsappSessionId: sessionRecord.id, externalMessageId: externalMessageId },
      data: updateData,
    }).catch(() => undefined);

    await this.recordEvent(sessionKey, 'MESSAGE_SENT', ack);
  }

  private async persistOutgoingMessage(
    sessionKey: string,
    chatId: string,
    content: string,
    externalMessageId?: string,
    messageType = 'text'
  ): Promise<void> {
    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    const contactPhone = this.extractPhoneFromId(chatId);

    let contact = await prisma.whatsAppContact.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalContactId: contactPhone },
      select: { id: true },
    }).catch(() => null);

    if (!contact) {
      contact = await prisma.whatsAppContact.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalContactId: contactPhone,
          phoneNumber: contactPhone,
        },
      }).catch(() => null);
    }

    let chat = await prisma.whatsAppChat.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalChatId: chatId },
      select: { id: true },
    }).catch(() => null);

    if (!chat) {
      chat = await prisma.whatsAppChat.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalChatId: chatId,
          chatType: 'individual',
        },
      }).catch(() => null);
    }

    await prisma.whatsAppMessage.create({
      data: {
        whatsappSessionId: sessionRecord.id,
        chatId: chat?.id ?? null,
        contactId: contact?.id ?? null,
        externalMessageId,
        direction: 'OUTGOING',
        messageType,
        content,
        status: 'SENT',
        sentAt: new Date(),
      },
    }).catch(() => undefined);

    await this.recordEvent(sessionKey, 'MESSAGE_SENT', { chatId, content, externalMessageId });
  }

  private async syncChatsToPrisma(sessionKey: string, chats: unknown[]): Promise<void> {
    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    for (const chat of chats) {
      const c = chat as Record<string, unknown>;
      const externalChatId = String(c.id ?? c.rid ?? '');
      if (!externalChatId) continue;

      const chatName = String(c.name ?? c.contactName ?? '');
      const unreadCount = Number(c.unreadCount ?? c.unread ?? 0);
      const lastMessageAt = c.lastMessageAt ? new Date(c.lastMessageAt as string) : undefined;

      await prisma.whatsAppChat.upsert({
        where: { whatsappSessionId_externalChatId: { whatsappSessionId: sessionRecord.id, externalChatId } },
        update: {
          chatName: chatName || null,
          unreadCount,
          lastMessageAt,
        },
        create: {
          whatsappSessionId: sessionRecord.id,
          externalChatId,
          chatName: chatName || null,
          chatType: String(c.isGroup ? 'group' : 'individual'),
          unreadCount,
          lastMessageAt,
        },
      }).catch(() => undefined);
    }

    await this.updateSyncState(sessionRecord.organizationId, sessionRecord.id, 'chats');
  }

  private async syncContactsToPrisma(sessionKey: string, contacts: unknown[]): Promise<void> {
    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    for (const contact of contacts) {
      const c = contact as Record<string, unknown>;
      const externalContactId = String(c.id ?? c.wid ?? c.number ?? '');
      if (!externalContactId) continue;

      const name = String(c.name ?? c.pushName ?? c.formattedName ?? '');
      const phoneNumber = String(c.number ?? c.phone ?? c.id ?? '');

      await prisma.whatsAppContact.upsert({
        where: { whatsappSessionId_externalContactId: { whatsappSessionId: sessionRecord.id, externalContactId } },
        update: {
          name: name || null,
          phoneNumber: phoneNumber || null,
          profilePictureUrl: String(c.profilePic ?? c.img ?? '') || null,
        },
        create: {
          whatsappSessionId: sessionRecord.id,
          externalContactId,
          name: name || null,
          phoneNumber: phoneNumber || null,
          profilePictureUrl: String(c.profilePic ?? c.img ?? '') || null,
        },
      }).catch(() => undefined);
    }

    await this.updateSyncState(sessionRecord.organizationId, sessionRecord.id, 'contacts');
  }

  private async syncGroupsToPrisma(sessionKey: string, groups: unknown[]): Promise<void> {
    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    for (const group of groups) {
      const g = group as Record<string, unknown>;
      const externalChatId = String(g.id ?? g.rid ?? g.groupId ?? '');
      if (!externalChatId) continue;

      const groupName = String(g.name ?? g.subject ?? '');

      await prisma.whatsAppChat.upsert({
        where: { whatsappSessionId_externalChatId: { whatsappSessionId: sessionRecord.id, externalChatId } },
        update: {
          chatName: groupName || null,
          chatType: 'group',
          unreadCount: 0,
        },
        create: {
          whatsappSessionId: sessionRecord.id,
          externalChatId,
          chatName: groupName || null,
          chatType: 'group',
          unreadCount: 0,
        },
      }).catch(() => undefined);
    }

    await this.updateSyncState(sessionRecord.organizationId, sessionRecord.id, 'groups');
  }

  private async persistMessagesFromChat(sessionKey: string, chatId: string, messages: unknown[]): Promise<void> {
    const sessionRecord = await this.getSessionRecord(sessionKey);
    if (!sessionRecord) {
      return;
    }

    const contactPhone = this.extractPhoneFromId(chatId);

    let contact = await prisma.whatsAppContact.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalContactId: contactPhone },
      select: { id: true },
    }).catch(() => null);

    if (!contact) {
      contact = await prisma.whatsAppContact.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalContactId: contactPhone,
          phoneNumber: contactPhone,
        },
      }).catch(() => null);
    }

    let chat = await prisma.whatsAppChat.findFirst({
      where: { whatsappSessionId: sessionRecord.id, externalChatId: chatId },
      select: { id: true },
    }).catch(() => null);

    if (!chat) {
      chat = await prisma.whatsAppChat.create({
        data: {
          whatsappSessionId: sessionRecord.id,
          externalChatId: chatId,
          chatType: 'individual',
        },
      }).catch(() => null);
    }

    for (const message of messages) {
      const m = message as Record<string, unknown>;
      const externalMessageId = String(m.id ?? m.messageId ?? '');
      if (!externalMessageId) continue;

      const isFromMe = Boolean(m.fromMe ?? m.from_me ?? false);
      const body = String(m.body ?? m.content ?? m.caption ?? '');
      const messageType = String(m.type ?? 'text');

      await prisma.whatsAppMessage.upsert({
        where: { whatsappSessionId_externalMessageId: { whatsappSessionId: sessionRecord.id, externalMessageId } },
        update: {
          content: body,
          messageType,
          direction: isFromMe ? 'OUTGOING' : 'INCOMING',
          status: isFromMe ? 'SENT' : 'DELIVERED',
        },
        create: {
          whatsappSessionId: sessionRecord.id,
          chatId: chat?.id ?? null,
          contactId: contact?.id ?? null,
          externalMessageId,
          direction: isFromMe ? 'OUTGOING' : 'INCOMING',
          messageType,
          content: body,
          status: isFromMe ? 'SENT' : 'DELIVERED',
          sentAt: m.t ? new Date(Number(m.t) * 1000) : new Date(),
        },
      }).catch(() => undefined);
    }

    await this.updateSyncState(sessionRecord.organizationId, sessionRecord.id, 'messages');
  }

  private async updateSyncState(organizationId: string, whatsappSessionId: string, resourceType: string): Promise<void> {
    const existing = await prisma.syncState.findFirst({
      where: { organizationId, whatsappSessionId, resourceType },
      select: { id: true },
    }).catch(() => null);

    if (existing) {
      await prisma.syncState.update({
        where: { id: existing.id },
        data: {
          status: 'COMPLETED',
          lastSyncedAt: new Date(),
          lastError: null,
        },
      }).catch(() => undefined);
    } else {
      await prisma.syncState.create({
        data: {
          organizationId,
          whatsappSessionId,
          resourceType,
          status: 'COMPLETED',
          lastSyncedAt: new Date(),
        },
      }).catch(() => undefined);
    }
  }

  private async recordEvent(sessionKey: string, eventType: string, payload: unknown): Promise<void> {
    const record = await prisma.whatsAppSession.findFirst({
      where: { sessionKey },
      select: { id: true },
    });

    if (!record?.id) {
      return;
    }

    await prisma.whatsAppEvent.create({
      data: {
        whatsappSessionId: record.id,
        eventType: eventType as never,
        severity: 'INFO',
        payload: payload as never,
      },
    }).catch(() => undefined);
  }

  private extractPhoneFromId(id: string): string {
    if (!id) return '';
    if (id.includes('@')) {
      return id.split('@')[0];
    }
    return id;
  }
}
