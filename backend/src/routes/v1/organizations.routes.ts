import { Router } from 'express';

import { OrganizationController } from '../../controllers/organization.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const organizationController = new OrganizationController();

router.post('/', authenticate, asyncHandler(organizationController.create.bind(organizationController)));
router.get('/:id', authenticate, asyncHandler(organizationController.getById.bind(organizationController)));
router.patch('/:id', authenticate, asyncHandler(organizationController.update.bind(organizationController)));
router.delete('/:id', authenticate, asyncHandler(organizationController.remove.bind(organizationController)));

export default router;
