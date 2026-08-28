import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { ProjectService } from '../services/projectService';

export const requireProjectMembership = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const projectId = req.params.projectId || req.params.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID parameter required' });
  }

  const isMember = ProjectService.isUserMember(projectId, userId);
  if (!isMember) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: You are not a registered member of this protected project. Enter the project password to join.',
    });
  }

  next();
};
