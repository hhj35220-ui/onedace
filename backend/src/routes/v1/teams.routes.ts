import { Router } from 'express';

import { TeamController } from '../../controllers/team.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const teamController = new TeamController();

router.post('/:organizationId/teams', authenticate, asyncHandler(teamController.create.bind(teamController)));
router.get('/:organizationId/teams', authenticate, asyncHandler(teamController.listByOrganization.bind(teamController)));
router.get('/:id', authenticate, asyncHandler(teamController.getById.bind(teamController)));
router.patch('/:id', authenticate, asyncHandler(teamController.update.bind(teamController)));
router.delete('/:id', authenticate, asyncHandler(teamController.remove.bind(teamController)));
router.post('/:id/members', authenticate, asyncHandler(teamController.addMember.bind(teamController)));
router.patch('/:id/members/:memberUserId', authenticate, asyncHandler(teamController.updateMember.bind(teamController)));
router.delete('/:id/members/:memberUserId', authenticate, asyncHandler(teamController.removeMember.bind(teamController)));

export default router;
