import { Router } from 'express';
import { authenticate } from '../../../middleware/auth.middleware';
import { WhatsAppController } from '../controllers/whatsapp.controller';

const router = Router();
const controller = new WhatsAppController();

router.post('/connect', authenticate, controller.connect);
router.get('/status', authenticate, controller.getStatus);
router.get('/qr', authenticate, controller.getQr);
router.post('/reconnect', authenticate, controller.reconnect);
router.post('/disconnect', authenticate, controller.disconnect);
router.get('/chats', authenticate, controller.getChats);
router.get('/contacts', authenticate, controller.getContacts);
router.get('/groups', authenticate, controller.getGroups);
router.get('/messages', authenticate, controller.getMessages);
router.post('/send', authenticate, controller.send);
router.post('/send-media', authenticate, controller.sendMedia);
router.post('/recover', authenticate, controller.recover);
router.post('/sync/chats', authenticate, controller.syncChats);
router.post('/sync/contacts', authenticate, controller.syncContacts);
router.post('/sync/groups', authenticate, controller.syncGroups);

export default router;
