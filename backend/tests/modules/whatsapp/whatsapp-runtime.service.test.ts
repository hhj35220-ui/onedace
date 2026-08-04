import { create } from '@wppconnect-team/wppconnect';
import { WhatsAppRuntimeService } from '../../../src/modules/whatsapp/services/whatsapp-runtime.service';

jest.mock('@wppconnect-team/wppconnect', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/config/database', () => ({
  prisma: {
    whatsAppSession: {
      updateMany: jest.fn().mockResolvedValue(undefined),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    whatsAppContact: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'contact' }),
      upsert: jest.fn().mockResolvedValue({ id: 'contact' }),
    },
    whatsAppChat: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'chat' }),
      upsert: jest.fn().mockResolvedValue({ id: 'chat' }),
    },
    whatsAppMessage: {
      create: jest.fn().mockResolvedValue(undefined),
      updateMany: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

jest.mock('../../../src/config/logger', () => ({
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('WhatsAppRuntimeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (create as jest.Mock).mockResolvedValue({
      close: jest.fn().mockResolvedValue(undefined),
      onStateChange: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onMessage: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onNotificationMessage: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onPresenceChanged: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onAck: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onAddedToGroup: jest.fn().mockReturnValue({ dispose: jest.fn() }),
      onParticipantsChanged: jest.fn().mockReturnValue({ dispose: jest.fn() }),
    });
  });

  it('launches WPPConnect in shell headless mode for browser compatibility', async () => {
    const service = new WhatsAppRuntimeService();

    await service.startSession('session-1');

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      session: 'session-1',
      headless: 'shell',
    }));
  });
});
