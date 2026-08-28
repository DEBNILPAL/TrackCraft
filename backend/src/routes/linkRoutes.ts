import { Router, Response } from 'express';
import { LinkService } from '../services/linkService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/links
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const links = LinkService.getProjectLinks(projectId);
    return res.status(200).json({ success: true, data: links });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching links' });
  }
});

// POST /api/projects/:projectId/links
router.post('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const projectId = req.params.projectId;
    const { title, url, description, category } = req.body;

    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Link Title and URL are required' });
    }

    const link = LinkService.addLink(user, projectId, {
      title,
      url,
      description: description || '',
      category,
    });

    return res.status(201).json({ success: true, data: link });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to add reference link' });
  }
});

// DELETE /api/projects/:projectId/links/:linkId
router.delete('/:linkId', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const linkId = req.params.linkId;
    LinkService.deleteLink(linkId);
    return res.status(200).json({ success: true, message: 'Link deleted' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Delete failed' });
  }
});

export default router;
