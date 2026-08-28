import { Router, Response } from 'express';
import { ProgressService } from '../services/progressService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router({ mergeParams: true });

// POST /api/projects/:projectId/progress - Log daily progress
router.post('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const projectId = req.params.projectId;
    const { role, progressPercentage, completedToday, currentlyWorkingOn, blockers, blockerStatus, nextSteps, notes, date } = req.body;

    if (!role || progressPercentage === undefined || !completedToday || !currentlyWorkingOn) {
      return res.status(400).json({
        success: false,
        message: 'Role, Progress Percentage, Completed Today, and Currently Working On are required fields',
      });
    }

    const log = ProgressService.addProgressLog(user, projectId, {
      role,
      progressPercentage: Number(progressPercentage),
      completedToday,
      currentlyWorkingOn,
      blockers,
      blockerStatus,
      nextSteps,
      notes,
      date,
    });

    return res.status(201).json({ success: true, data: log });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to record progress' });
  }
});

// GET /api/projects/:projectId/progress - Get logs, role breakdown, and health summary
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const logs = ProgressService.getProjectProgressLogs(projectId);
    const roleBreakdown = ProgressService.getRoleProgressBreakdown(projectId);
    const healthSummary = ProgressService.getProjectHealthAndProgress(projectId);

    return res.status(200).json({
      success: true,
      data: {
        logs,
        roleBreakdown,
        healthSummary,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching progress data' });
  }
});

export default router;
