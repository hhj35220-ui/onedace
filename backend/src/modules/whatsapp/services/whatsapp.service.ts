import { prisma } from '../../../config/database';
import { AppError } from '../../../utils/AppError';
import { WhatsAppRuntimeService } from './whatsapp-runtime.service';

export class WhatsAppService {
  constructor(private readonly runtimeService = new WhatsAppRuntimeService()) {}

  async connectOrganizationSession(organizationId: string, userId: string, sessionKey: string) {
    const organization = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    let connection = await prisma.platformConnection.findFirst({
      where: { organizationId, userId, platformType: 'WHATSAPP' },
    });

    if (!connection) {
      connection = await prisma.platformConnection.create({
        data: {
          organizationId,
          userId,
          platformType: 'WHATSAPP',
          status: 'CONNECTING',
          displayName: 'WhatsApp',
        },
      });
    }

    await prisma.whatsAppSession.upsert({
      where: { sessionKey },
      update: {
        platformConnectionId: connection.id,
        organizationId,
        status: 'CONNECTING',
        lastError: null,
      },
      create: {
        platformConnectionId: connection.id,
        organizationId,
        sessionKey,
        status: 'CONNECTING',
      },
    });

    await this.runtimeService.startSession(sessionKey);

    return {
      success: true,
      data: {
        organizationId,
        sessionKey,
        status: 'CONNECTING',
      },
    };
  }

  async getStatus(organizationId: string, sessionKey: string) {
    const session = await prisma.whatsAppSession.findFirst({
      where: { organizationId, sessionKey },
      select: { status: true, qrCodeUrl: true, phoneNumber: true, lastConnectedAt: true, lastSeenAt: true, lastError: true },
    });

    const runtimeStatus = await this.runtimeService.getStatus(sessionKey);
    const qrCode = await this.runtimeService.getQRCode(sessionKey);
    const status = runtimeStatus?.status ?? session?.status ?? 'DISCONNECTED';

    return {
      success: true,
      data: {
        organizationId,
        sessionKey,
        status,
        qrCodeUrl: qrCode ?? session?.qrCodeUrl ?? null,
        phoneNumber: session?.phoneNumber ?? null,
        lastConnectedAt: session?.lastConnectedAt ?? null,
        lastSeenAt: session?.lastSeenAt ?? null,
        lastError: session?.lastError ?? null,
      },
    };
  }

  async getQr(organizationId: string, sessionKey: string) {
    const session = await prisma.whatsAppSession.findFirst({
      where: { organizationId, sessionKey },
      select: { qrCodeUrl: true },
    });

    const qrCode = await this.runtimeService.getQRCode(sessionKey);

    return {
      success: true,
      data: {
        organizationId,
        sessionKey,
        qrCode: qrCode ?? session?.qrCodeUrl ?? null,
      },
    };
  }

  async reconnect(organizationId: string, _userId: string, sessionKey: string) {
    await this.runtimeService.restartSession(sessionKey);
    await prisma.whatsAppSession.updateMany({
      where: { organizationId, sessionKey },
      data: { status: 'RECONNECTING' },
    });
    return { success: true, data: { organizationId, sessionKey, status: 'RECONNECTING' } };
  }

  async disconnect(organizationId: string, sessionKey: string) {
    await this.runtimeService.stopSession(sessionKey);
    await prisma.whatsAppSession.updateMany({
      where: { organizationId, sessionKey },
      data: { status: 'DISCONNECTED' },
    });
    return { success: true, data: { organizationId, sessionKey, status: 'DISCONNECTED' } };
  }

  async getChats(_organizationId: string, sessionKey: string) {
    const chats = await this.runtimeService.listChats(sessionKey);
    return { success: true, data: chats };
  }

  async getContacts(_organizationId: string, sessionKey: string) {
    const contacts = await this.runtimeService.listContacts(sessionKey);
    return { success: true, data: contacts };
  }

  async getGroups(_organizationId: string, sessionKey: string) {
    const groups = await this.runtimeService.listGroups(sessionKey);
    return { success: true, data: groups };
  }

  async getMessages(organizationId: string, sessionKey: string, chatId: string, limit = 50) {
    const messages = await this.runtimeService.getMessages(sessionKey, chatId, limit);
    return { success: true, data: { organizationId, sessionKey, chatId, messages } };
  }

  async sendMessage(organizationId: string, sessionKey: string, payload: { recipient: string; content: string; messageType?: string }) {
    const result = await this.runtimeService.sendMessage(sessionKey, payload.recipient, payload.content);
    return { success: true, data: { organizationId, sessionKey, message: result.ok ? 'queued' : 'failed', error: result.error ?? null } };
  }

  async sendMedia(organizationId: string, sessionKey: string, payload: { recipient: string; filePath: string }) {
    const result = await this.runtimeService.sendMedia(sessionKey, payload.recipient, payload.filePath);
    return { success: true, data: { organizationId, sessionKey, media: result.ok ? 'queued' : 'failed', error: result.error ?? null } };
  }

  async recoverSession(organizationId: string, sessionKey: string) {
    const result = await this.runtimeService.recoverSession(sessionKey);
    await prisma.whatsAppSession.updateMany({
      where: { organizationId, sessionKey },
      data: { status: result.status as never },
    });
    return { success: true, data: { organizationId, sessionKey, status: result.status } };
  }

  async syncChats(organizationId: string, sessionKey: string) {
    const chats = await this.runtimeService.listChats(sessionKey);
    return { success: true, data: { organizationId, sessionKey, synced: chats.length } };
  }

  async syncContacts(organizationId: string, sessionKey: string) {
    const contacts = await this.runtimeService.listContacts(sessionKey);
    return { success: true, data: { organizationId, sessionKey, synced: contacts.length } };
  }

  async syncGroups(organizationId: string, sessionKey: string) {
    const groups = await this.runtimeService.listGroups(sessionKey);
    return { success: true, data: { organizationId, sessionKey, synced: groups.length } };
  }
}
