import { Router } from 'express';
import { AuditController } from '../../controllers/audit.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new AuditController();

router.get('/', authenticate, asyncHandler(controller.list.bind(controller)));
router.get('/:id', authenticate, asyncHandler(controller.getById.bind(controller)));
router.get('/entity/:entityType/:entityId', authenticate, asyncHandler(controller.getByEntity.bind(controller)));

export default router;
