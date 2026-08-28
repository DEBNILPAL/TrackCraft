import { Router, Response } from 'express';
import { MeetingService } from '../services/meetingService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/authMiddleware';
import { requireProjectMembership } from '../middleware/projectAccessMiddleware';

const router = Router({ mergeParams: true });

// GET /api/projects/:projectId/meetings
router.get('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const data = MeetingService.getProjectMeetings(projectId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error fetching meetings' });
  }
});

// POST /api/projects/:projectId/meetings
router.post('/', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const projectId = req.params.projectId;
    const { title, date, time, meetingLink, agenda, durationMinutes } = req.body;

    if (!title || !date || !time || !meetingLink || !agenda) {
      return res.status(400).json({
        success: false,
        message: 'Title, Date, Time, Meeting Link, and Agenda are required fields',
      });
    }

    const meeting = MeetingService.scheduleMeeting(user, projectId, {
      title,
      date,
      time,
      meetingLink,
      agenda,
      durationMinutes,
    });

    return res.status(201).json({ success: true, data: meeting });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Failed to schedule meeting' });
  }
});

// DELETE /api/projects/:projectId/meetings/:meetingId
router.delete('/:meetingId', authenticateToken, requireProjectMembership, (req: AuthenticatedRequest, res: Response) => {
  try {
    const meetingId = req.params.meetingId;
    MeetingService.deleteMeeting(meetingId);
    return res.status(200).json({ success: true, message: 'Meeting deleted' });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'Delete failed' });
  }
});

export default router;
