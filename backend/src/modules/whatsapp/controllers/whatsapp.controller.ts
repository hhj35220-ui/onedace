import { Request, Response } from 'express';
import { AppError } from '../../../utils/AppError';
import { asyncHandler } from '../../../utils/asyncHandler';
import { connectWhatsAppSchema, reconnectWhatsAppSchema, sendWhatsAppMessageSchema } from '../validators/whatsapp.validator';
import { WhatsAppService } from '../services/whatsapp.service';

export class WhatsAppController {
  constructor(private readonly whatsappService = new WhatsAppService()) {}

  connect = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const payload = connectWhatsAppSchema.parse(req.body ?? {});
    const result = await this.whatsappService.connectOrganizationSession(payload.organizationId, req.user.id, payload.sessionKey ?? `oneplace-${req.user.id}`);
    res.status(200).json(result);
  });

  getStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.getStatus(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  getQr = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.getQr(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  reconnect = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const payload = reconnectWhatsAppSchema.parse(req.body ?? {});
    const result = await this.whatsappService.reconnect(payload.organizationId, req.user.id, payload.sessionKey ?? `oneplace-${req.user.id}`);
    res.status(200).json(result);
  });

  disconnect = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.disconnect(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  getChats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.getChats(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  getContacts = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.getContacts(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  getGroups = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.getGroups(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  getMessages = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const chatId = req.params.chatId ?? req.query.chatId?.toString();
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    if (!chatId) {
      throw new AppError('chatId is required', 400);
    }
    const result = await this.whatsappService.getMessages(organizationId as string, sessionKey, chatId, limit);
    res.status(200).json(result);
  });

  send = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const payload = sendWhatsAppMessageSchema.parse(req.body ?? {});
    const sessionKey = payload.sessionKey ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.sendMessage(payload.organizationId, sessionKey, payload);
    res.status(200).json(result);
  });

  sendMedia = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const payload = sendWhatsAppMessageSchema.parse(req.body ?? {});
    const sessionKey = payload.sessionKey ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.sendMedia(payload.organizationId, sessionKey, {
      recipient: payload.recipient,
      filePath: payload.content,
    });
    res.status(200).json(result);
  });

  recover = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.recoverSession(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  syncChats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.syncChats(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  syncContacts = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.syncContacts(organizationId as string, sessionKey);
    res.status(200).json(result);
  });

  syncGroups = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const organizationId = req.params.organizationId ?? req.query.organizationId;
    const sessionKey = req.query.sessionKey?.toString() ?? `oneplace-${req.user.id}`;
    const result = await this.whatsappService.syncGroups(organizationId as string, sessionKey);
    res.status(200).json(result);
  });
}
