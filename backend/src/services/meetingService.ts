import { JsonStorage } from '../storage/jsonStorage';
import { Meeting, UserSanitized, ActivityItem } from '../types';
import { NotificationService } from './notificationService';

const meetingStorage = new JsonStorage<Meeting>('meetings');
const activityStorage = new JsonStorage<ActivityItem>('activity');

export class MeetingService {
  /**
   * Schedule a meeting
   */
  static scheduleMeeting(
    user: UserSanitized,
    projectId: string,
    data: {
      title: string;
      date: string;
      time: string;
      meetingLink: string;
      agenda: string;
      durationMinutes?: number;
    }
  ): Meeting {
    const trimmedLink = data.meetingLink.trim();

    if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
      throw new Error('Please provide a valid meeting link starting with http:// or https://');
    }

    const meeting: Meeting = {
      id: `meet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      title: data.title.trim(),
      date: data.date,
      time: data.time,
      durationMinutes: Number(data.durationMinutes) || 45,
      meetingLink: trimmedLink,
      agenda: data.agenda.trim(),
      createdBy: user.id,
      createdByName: user.fullName,
      createdAt: new Date().toISOString(),
    };

    meetingStorage.insert(meeting);

    // Log Activity Timeline Item
    activityStorage.insert({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      action: `scheduled meeting: "${data.title.trim()}" for ${data.date} at ${data.time}`,
      details: data.agenda,
      createdAt: new Date().toISOString(),
    });

    // Notify project teammates
    NotificationService.notifyProjectMembers(
      projectId,
      user.id,
      'Meeting Scheduled',
      `${user.fullName} scheduled "${data.title.trim()}" for ${data.date} at ${data.time}.`,
      'meeting'
    );

    return meeting;
  }

  /**
   * Get project meetings split into upcoming and past
   */
  static getProjectMeetings(projectId: string) {
    const meetings = meetingStorage.filter((m) => m.projectId === projectId);
    const now = new Date();

    const sorted = meetings.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });

    const upcoming: Meeting[] = [];
    const past: Meeting[] = [];

    sorted.forEach((m) => {
      const meetDate = new Date(`${m.date}T${m.time || '23:59'}`);
      if (meetDate >= now) {
        upcoming.push(m);
      } else {
        past.push(m);
      }
    });

    return { upcoming, past, total: meetings.length };
  }

  /**
   * Delete meeting
   */
  static deleteMeeting(meetingId: string): boolean {
    return meetingStorage.delete(meetingId);
  }
}
