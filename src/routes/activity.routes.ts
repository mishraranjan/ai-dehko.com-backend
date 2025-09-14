import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/recent', authMiddleware, ActivityController.getRecentActivities.bind(ActivityController));
router.get('/stats', authMiddleware, ActivityController.getActivityStats.bind(ActivityController));

export default router;