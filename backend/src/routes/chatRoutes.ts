import { Router, Response } from 'express';
import { ChatService } from '../services/chatService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/messages
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const messages = ChatService.getProjectMessages(projectId);
    return res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to retrieve messages' });
  }
});

// POST /api/projects/:projectId/messages
router.post('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const projectId = req.params.projectId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const message = ChatService.sendMessage(user, projectId, content);
    return res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to send message' });
  }
});

// DELETE /api/projects/:projectId/messages/:messageId
router.delete('/:messageId', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const messageId = req.params.messageId;
    ChatService.deleteMessage(messageId, userId);
    return res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Delete failed' });
  }
});

export default router;
