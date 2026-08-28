import { Router, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// GET /api/notifications
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const data = NotificationService.getUserNotifications(userId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    NotificationService.markAllAsRead(userId);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Update failed' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    NotificationService.markAsRead(req.params.id);
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Update failed' });
  }
});

export default router;
