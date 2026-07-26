import { Router } from 'express';

import { TaskTimeEntryController } from '../../controllers/task-time-entry.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskTimeEntryController = new TaskTimeEntryController();

router.get('/tasks/:taskId/time-entries', authenticate, asyncHandler(taskTimeEntryController.listTimeEntries.bind(taskTimeEntryController)));
router.post('/tasks/:taskId/time-entries/start', authenticate, asyncHandler(taskTimeEntryController.startTimeEntry.bind(taskTimeEntryController)));
router.patch('/time-entries/:entryId/stop', authenticate, asyncHandler(taskTimeEntryController.stopTimeEntry.bind(taskTimeEntryController)));
router.patch('/time-entries/:entryId', authenticate, asyncHandler(taskTimeEntryController.updateTimeEntry.bind(taskTimeEntryController)));
router.delete('/time-entries/:entryId', authenticate, asyncHandler(taskTimeEntryController.deleteTimeEntry.bind(taskTimeEntryController)));

export default router;
