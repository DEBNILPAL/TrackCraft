import { Router, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router();

// GET /api/projects - View all public project cards
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const projects = ProjectService.getAllProjects(userId);
    return res.status(200).json({ success: true, data: projects });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch projects' });
  }
});

// POST /api/projects - Create a new project
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { name, description, password, confirmPassword, status, startDate, expectedEndDate, hackathon, techStack, logoUrl, ownerRole } = req.body;

    if (!name || !description || !password) {
      return res.status(400).json({ success: false, message: 'Project Name, Description, and Password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Project passwords do not match' });
    }

    const result = await ProjectService.createProject(user, {
      name,
      description,
      password,
      status,
      startDate,
      expectedEndDate,
      hackathon,
      techStack,
      logoUrl,
      ownerRole,
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Project creation failed' });
  }
});

// POST /api/projects/:id/join - Join protected project with password
router.post('/:id/join', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;
    const { password, role } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Project password is required' });
    }

    const membership = await ProjectService.joinProjectWithPassword(projectId, userId, password, role);
    return res.status(200).json({
      success: true,
      message: 'Project joined successfully!',
      data: { membership },
    });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message || 'Password verification failed' });
  }
});

// GET /api/projects/:id - Get project details
router.get('/:id', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const projectId = req.params.id;
    const project = ProjectService.getProjectById(projectId, userId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error loading project' });
  }
});

// GET /api/projects/:id/members - Get project members
router.get('/:id/members', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const members = ProjectService.getProjectMembers(projectId);
    return res.status(200).json({ success: true, data: members });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error loading team members' });
  }
});

// PUT /api/projects/:id/members/:userId/role - Update user project role
router.put('/:id/members/:userId/role', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const targetUserId = req.params.userId;
    const { role } = req.body;

    // Users can change their own role, or project owner can change any member's role
    if (req.user!.id !== targetUserId) {
      const proj = ProjectService.getProjectById(projectId, req.user!.id);
      if (!proj?.isOwner) {
        return res.status(403).json({ success: false, message: 'Only project owners can change another member\'s role' });
      }
    }

    const updatedMembership = ProjectService.updateMemberRole(projectId, targetUserId, role);
    return res.status(200).json({ success: true, data: updatedMembership });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to update member role' });
  }
});

// PUT /api/projects/:id - Update project settings (owner only)
router.put('/:id', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = req.user!.id;
    const updated = ProjectService.updateProject(projectId, userId, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Update failed' });
  }
});

// DELETE /api/projects/:id - Delete project (Project Manager / Owner only)
router.delete('/:id', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = req.user!.id;
    ProjectService.deleteProject(projectId, userId);
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to delete project' });
  }
});

// DELETE /api/projects/:id/members/:userId - Remove member from project
router.delete('/:id/members/:userId', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const targetUserId = req.params.userId;
    const requestingUserId = req.user!.id;
    ProjectService.removeMember(projectId, requestingUserId, targetUserId);
    return res.status(200).json({ success: true, message: 'Member removed from project successfully' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to remove member' });
  }
});

export default router;

