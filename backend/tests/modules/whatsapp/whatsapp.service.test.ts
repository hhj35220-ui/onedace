import { prisma } from '../../../src/config/database';
import { WhatsAppController } from '../../../src/modules/whatsapp/controllers/whatsapp.controller';
import { WhatsAppService } from '../../../src/modules/whatsapp/services/whatsapp.service';

jest.mock('../../../src/config/database', () => ({
  prisma: {
    organization: {
      findUnique: jest.fn(),
    },
    platformConnection: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    whatsAppSession: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('WhatsAppService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the persisted session status for an organization session', async () => {
    const runtimeService = {
      startSession: jest.fn().mockResolvedValue({ sessionKey: 'session-1', status: 'STARTING' }),
      restartSession: jest.fn().mockResolvedValue({ sessionKey: 'session-1', status: 'RECONNECTING' }),
      stopSession: jest.fn().mockResolvedValue(undefined),
      sendMessage: jest.fn().mockResolvedValue({ ok: true }),
      sendMedia: jest.fn().mockResolvedValue({ ok: true }),
      getStatus: jest.fn().mockResolvedValue({ sessionKey: 'session-1', status: 'CONNECTED' }),
      getQRCode: jest.fn().mockResolvedValue(null),
      listChats: jest.fn().mockResolvedValue([]),
      listContacts: jest.fn().mockResolvedValue([]),
      listGroups: jest.fn().mockResolvedValue([]),
    };

    const service = new WhatsAppService(runtimeService as never);
    (prisma.whatsAppSession.findFirst as jest.Mock).mockResolvedValue({
      status: 'CONNECTED',
      qrCodeUrl: null,
      phoneNumber: '+15551234567',
    });

    const result = await service.getStatus('org-1', 'session-1');

    expect(prisma.whatsAppSession.findFirst).toHaveBeenCalledWith({
      where: { organizationId: 'org-1', sessionKey: 'session-1' },
      select: { status: true, qrCodeUrl: true, phoneNumber: true, lastConnectedAt: true, lastSeenAt: true, lastError: true },
    });
    expect(result.data.status).toBe('CONNECTED');
  });

  it('preserves the explicit session key when sending a WhatsApp message', async () => {
    const whatsappService = {
      sendMessage: jest.fn().mockResolvedValue({ success: true, data: { ok: true } }),
      sendMedia: jest.fn().mockResolvedValue({ success: true, data: { ok: true } }),
    };

    const controller = new WhatsAppController(whatsappService as never);
    const req = {
      user: { id: 'user-1' },
      body: {
        organizationId: '11111111-1111-1111-1111-111111111111',
        sessionKey: 'session-1',
        recipient: '5511999999999',
        content: 'hello from tests',
        messageType: 'text',
      },
    } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await (controller.send as unknown as (req: any, res: any, next?: any) => Promise<void>)(req, res, jest.fn());

    expect(whatsappService.sendMessage).toHaveBeenCalledWith(
      '11111111-1111-1111-1111-111111111111',
      'session-1',
      expect.objectContaining({ recipient: '5511999999999', content: 'hello from tests', messageType: 'text' }),
    );
  });
});
