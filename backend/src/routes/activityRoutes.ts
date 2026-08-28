import { Router, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/activity
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const activity = NotificationService.getProjectActivity(projectId);
    return res.status(200).json({ success: true, data: activity });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch project activity' });
  }
});

export default router;
