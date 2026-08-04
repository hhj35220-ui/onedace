import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { spawnSync } from 'child_process';
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
  getWid?: () => Promise<string>;
  getHostDevice?: () => Promise<{ phone?: { number?: string | null } | null } | unknown>;
  isAuthenticated?: () => Promise<boolean>;
  isMainReady?: () => Promise<boolean>;
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
  private sessionDataDirs = new Map<string, string>();
  private manuallyStopped = new Set<string>();
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelayMs = 5000;

  async startSession(sessionKey: string): Promise<{ sessionKey: string; status: string }> {
    const existingStatus = this.sessions.get(sessionKey)?.status;
    if (this.clients.has(sessionKey) && existingStatus && existingStatus !== 'DISCONNECTED' && existingStatus !== 'ERROR') {
      return { sessionKey, status: existingStatus };
    }

    this.manuallyStopped.delete(sessionKey);
    const sessionFolderName = this.getSessionFolderName(sessionKey);
    const tokenFolder = path.resolve(process.cwd(), 'wppconnect-tokens');
    const userDataDir = path.resolve(os.tmpdir(), `oneplace-whatsapp-${sessionFolderName}-${Date.now()}`);

    await this.killStaleSessionBrowsers(sessionKey).catch(() => undefined);
    await this.cleanupOldSessionDataDirs(sessionKey).catch(() => undefined);

    fs.mkdirSync(tokenFolder, { recursive: true });
    fs.mkdirSync(userDataDir, { recursive: true });
    this.sessionDataDirs.set(sessionKey, userDataDir);

    let runtimeClient: RuntimeClient | null = null;

    try {
      const client = (await createWppConnect({
        session: sessionKey,
        headless: 'shell',
        logQR: false,
        autoClose: 0,
        waitForLogin: false,
        disableWelcome: true,
        updatesLog: false,
        folderNameToken: tokenFolder,
        puppeteerOptions: {
          userDataDir,
          args: [
            '--log-level=3',
            '--no-default-browser-check',
            '--disable-site-isolation-trials',
            '--no-experiments',
            '--ignore-gpu-blacklist',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps',
            '--enable-features=NetworkService',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--disable-webgl',
            '--disable-infobars',
            '--window-position=0,0',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-in-process-stack-traces',
            '--disable-histogram-customizer',
            '--disable-gl-extensions',
            '--disable-composited-antialiasing',
            '--disable-canvas-aa',
            '--disable-3d-apis',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--disable-accelerated-mjpeg-decode',
            '--disable-app-list-dismiss-on-blur',
            '--disable-accelerated-video-decode',
            '--disable-dev-shm-usage',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-blink-features=AutomationControlled',
          ],
        },
        statusFind: async (status: string) => {
          const normalizedStatus = this.normalizeStatus(status);
          await this.recordRuntimeStatus(sessionKey, normalizedStatus, runtimeClient);
        },
        catchQR: async (qrCode: string) => {
          await this.updateSessionState(sessionKey, { status: 'QR_READY', qrCodeUrl: qrCode, lastError: null });
        },
      })) as RuntimeClient;

      runtimeClient = client;

      const disposers: Disposer[] = [];

      const stateChangeHandler = client.onStateChange?.((state: unknown) => {
        const normalizedStatus = this.normalizeStatus(String(state));
        void this.recordRuntimeStatus(sessionKey, normalizedStatus, client);
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
      const stack = error instanceof Error ? error.stack : undefined;
      await this.updateSessionState(sessionKey, { status: 'ERROR', lastError: errorMessage });
      log.error('Failed to start WhatsApp session', { sessionKey, error: errorMessage, stack });
      await this.cleanupFailedSession(sessionKey).catch(() => undefined);
      return { sessionKey, status: 'ERROR' };
    }
  }

  async stopSession(sessionKey: string): Promise<void> {
    this.manuallyStopped.add(sessionKey);

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

    await this.cleanupSessionDataDir(sessionKey).catch(() => undefined);
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

  private async recordRuntimeStatus(sessionKey: string, status: string, client: RuntimeClient | null): Promise<void> {
    if (status === 'CONNECTED') {
      const authEvidence = await this.resolveAuthEvidence(client);
      if (!authEvidence.hasEvidence) {
        log.info('Deferring CONNECTED promotion until WhatsApp authentication evidence is available', {
          sessionKey,
          status,
          authenticated: authEvidence.authenticated,
          ready: authEvidence.ready,
          phoneNumber: authEvidence.phoneNumber,
        });
        await this.updateSessionState(sessionKey, { status: 'CONNECTING', lastError: null });
        return;
      }

      await this.updateSessionState(sessionKey, {
        status: 'CONNECTED',
        phoneNumber: authEvidence.phoneNumber ?? null,
        lastError: null,
      });
      return;
    }

    await this.updateSessionState(sessionKey, { status });
  }

  private async resolveAuthEvidence(client: RuntimeClient | null): Promise<{ hasEvidence: boolean; authenticated: boolean; ready: boolean; phoneNumber: string | null }> {
    if (!client) {
      return { hasEvidence: false, authenticated: false, ready: false, phoneNumber: null };
    }

    const authenticated = await client.isAuthenticated?.().catch(() => false) ?? false;
    const ready = await client.isMainReady?.().catch(() => false) ?? false;
    const wid = await client.getWid?.().catch(() => null) ?? null;
    const phoneNumber = wid ? this.extractPhoneFromId(wid) : null;
    const hasEvidence = authenticated && ready && !!wid && !!phoneNumber;

    return { hasEvidence, authenticated, ready, phoneNumber };
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
    if (this.manuallyStopped.has(sessionKey)) {
      log.info('Skipping reconnect because session was manually stopped', { sessionKey });
      return;
    }

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

  private async cleanupSessionDataDir(sessionKey: string): Promise<void> {
    const dataDir = this.sessionDataDirs.get(sessionKey);
    if (!dataDir) {
      return;
    }

    this.sessionDataDirs.delete(sessionKey);
    try {
      if (fs.existsSync(dataDir)) {
        await fs.promises.rm(dataDir, { recursive: true, force: true });
      }
    } catch (error) {
      log.warn('Failed to cleanup WhatsApp session data directory', { sessionKey, dataDir, error: error instanceof Error ? error.message : error });
    }
  }

  private async cleanupFailedSession(sessionKey: string): Promise<void> {
    const sessionFolderName = this.getSessionFolderName(sessionKey);
    const tokenFolder = path.resolve(process.cwd(), 'wppconnect-tokens', sessionFolderName);

    await this.cleanupSessionDataDir(sessionKey).catch(() => undefined);

    try {
      if (fs.existsSync(tokenFolder)) {
        await fs.promises.rm(tokenFolder, { recursive: true, force: true });
        log.info('Removed failed WhatsApp session token directory', { sessionKey, tokenFolder });
      }
    } catch (error) {
      log.warn('Failed to cleanup failed WhatsApp session token directory', { sessionKey, tokenFolder, error: error instanceof Error ? error.message : error });
    }
  }

  private async killStaleSessionBrowsers(sessionKey: string): Promise<void> {
    const sessionFolderName = this.getSessionFolderName(sessionKey);
    const prefix = `oneplace-whatsapp-${sessionFolderName}-`;
    const tempDir = os.tmpdir();

    try {
      const items = await fs.promises.readdir(tempDir, { withFileTypes: true });
      const staleDirs = items
        .filter((item) => item.isDirectory() && item.name.startsWith(prefix))
        .map((item) => path.resolve(tempDir, item.name));

      if (!staleDirs.length) {
        return;
      }

      const matchedPids = new Set<number>();
      const searchTerm = staleDirs.map((dir) => dir.replace(/\\/g, '\\\\')).join('|');

      if (process.platform === 'win32') {
        const command = `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine -match '${searchTerm}' } | Select-Object -ExpandProperty ProcessId`;
        const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8' });
        if (result.status === 0 && result.stdout) {
          for (const line of result.stdout.split(/\r?\n/).map((line) => line.trim())) {
            const pid = Number(line);
            if (Number.isInteger(pid) && pid > 0) {
              matchedPids.add(pid);
            }
          }
        }
      } else {
        const result = spawnSync('ps', ['-ax', '-o', 'pid=,args='], { encoding: 'utf8' });
        if (result.status === 0 && result.stdout) {
          for (const line of result.stdout.split(/\r?\n/)) {
            if (!line.trim()) {
              continue;
            }
            const [pidString, ...args] = line.trim().split(/\s+/);
            const pid = Number(pidString);
            if (!Number.isInteger(pid) || pid <= 0) {
              continue;
            }
            const argsString = args.join(' ');
            if (staleDirs.some((dir) => argsString.includes(dir))) {
              matchedPids.add(pid);
            }
          }
        }
      }

      for (const pid of matchedPids) {
        try {
          process.kill(pid, 'SIGKILL');
          log.info('Killed stale WhatsApp browser process', { sessionKey, pid });
        } catch {
          try {
            if (process.platform === 'win32') {
              spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)], { encoding: 'utf8' });
            }
          } catch {
            // Ignore kill failures
          }
        }
      }
    } catch (error) {
      log.warn('Failed to cleanup stale WhatsApp browser processes', { sessionKey, error: error instanceof Error ? error.message : error });
    }
  }

  private async cleanupOldSessionDataDirs(currentSessionKey: string): Promise<void> {
    const sessionFolderName = this.getSessionFolderName(currentSessionKey);
    const prefix = `oneplace-whatsapp-${sessionFolderName}-`;
    try {
      const tempDir = os.tmpdir();
      const items = await fs.promises.readdir(tempDir, { withFileTypes: true });
      await Promise.all(items.map(async (item) => {
        if (!item.isDirectory()) {
          return;
        }
        const itemName = item.name;
        if (!itemName.startsWith(prefix)) {
          return;
        }

        const itemPath = path.resolve(tempDir, itemName);
        try {
          await fs.promises.rm(itemPath, { recursive: true, force: true });
          log.info('Removed stale WhatsApp session user data directory', { path: itemPath, sessionKey: currentSessionKey });
        } catch {
          // Directory may be locked by another process or already removed.
        }
      }));
    } catch (error) {
      log.warn('Failed to cleanup stale WhatsApp user data directories', { error: error instanceof Error ? error.message : error });
    }
  }

  private getSessionFolderName(sessionKey: string): string {
    return sessionKey.replace(/[^a-zA-Z0-9-_]/g, '_');
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