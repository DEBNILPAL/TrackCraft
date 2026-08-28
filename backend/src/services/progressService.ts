import { JsonStorage } from '../storage/jsonStorage';
import { ProgressLog, Membership, UserRole, BlockerStatus, UserSanitized, ActivityItem } from '../types';
import { AuthService } from './authService';
import { NotificationService } from './notificationService';

const progressStorage = new JsonStorage<ProgressLog>('progress');
const membershipStorage = new JsonStorage<Membership>('memberships');
const activityStorage = new JsonStorage<ActivityItem>('activity');

export class ProgressService {
  /**
   * Log daily progress for a user in a project
   */
  static addProgressLog(
    user: UserSanitized,
    projectId: string,
    data: {
      role: UserRole;
      progressPercentage: number;
      completedToday: string;
      currentlyWorkingOn: string;
      blockers?: string;
      blockerStatus?: BlockerStatus;
      nextSteps?: string;
      notes?: string;
      date?: string;
    }
  ): ProgressLog {
    const clampedProgress = Math.min(100, Math.max(0, Number(data.progressPercentage) || 0));
    const todayStr = data.date || new Date().toISOString().split('T')[0];

    const log: ProgressLog = {
      id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      role: data.role,
      progressPercentage: clampedProgress,
      completedToday: data.completedToday.trim(),
      currentlyWorkingOn: data.currentlyWorkingOn.trim(),
      blockers: data.blockers?.trim() || '',
      blockerStatus: data.blockerStatus || 'None',
      nextSteps: data.nextSteps?.trim() || '',
      notes: data.notes?.trim() || '',
      date: todayStr,
      createdAt: new Date().toISOString(),
    };

    progressStorage.insert(log);

    // Update user's membership progress & role
    const memberships = membershipStorage.filter((m) => m.projectId === projectId && m.userId === user.id);
    if (memberships.length > 0) {
      membershipStorage.update(memberships[0].id, {
        role: data.role,
        currentProgress: clampedProgress,
        updatedAt: new Date().toISOString(),
      });
    }

    // Log Activity Timeline Item
    activityStorage.insert({
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      action: `updated ${data.role} progress to ${clampedProgress}%`,
      details: data.completedToday,
      createdAt: new Date().toISOString(),
    });

    // Notify project teammates
    NotificationService.notifyProjectMembers(
      projectId,
      user.id,
      'Progress Update Logged',
      `${user.fullName} updated ${data.role} progress to ${clampedProgress}%.`,
      'progress'
    );

    return log;
  }

  /**
   * Get progress history logs for a project
   */
  static getProjectProgressLogs(projectId: string): ProgressLog[] {
    const logs = progressStorage.filter((p) => p.projectId === projectId);
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get Role-Based Progress Breakdown
   */
  static getRoleProgressBreakdown(projectId: string) {
    const memberships = membershipStorage.filter((m) => m.projectId === projectId);
    const roleStats: Record<string, { role: string; count: number; totalProgress: number; avgProgress: number; members: string[] }> = {};

    memberships.forEach((m) => {
      const user = AuthService.getUserById(m.userId);
      const userName = user?.fullName || 'Teammate';

      if (!roleStats[m.role]) {
        roleStats[m.role] = {
          role: m.role,
          count: 0,
          totalProgress: 0,
          avgProgress: 0,
          members: [],
        };
      }
      roleStats[m.role].count += 1;
      roleStats[m.role].totalProgress += m.currentProgress || 0;
      roleStats[m.role].members.push(userName);
    });

    const breakdown = Object.values(roleStats).map((stat) => ({
      role: stat.role,
      count: stat.count,
      avgProgress: Math.round(stat.totalProgress / stat.count),
      members: stat.members,
    }));

    return breakdown;
  }

  /**
   * Calculate overall project completion & health indicators
   */
  static getProjectHealthAndProgress(projectId: string) {
    const memberships = membershipStorage.filter((m) => m.projectId === projectId);
    const logs = progressStorage.filter((p) => p.projectId === projectId);

    const overallProgress = memberships.length > 0
      ? Math.round(memberships.reduce((acc, m) => acc + (m.currentProgress || 0), 0) / memberships.length)
      : 0;

    const blockedMembers = logs.filter((l) => l.blockerStatus === 'Blocked' || l.blockerStatus === 'Needs Help');
    const recentLogs = logs.slice(0, 5);

    let health: 'Healthy' | 'At Risk' | 'Critical' = 'Healthy';
    let healthReason = 'Project development is on track.';

    if (blockedMembers.length >= 2 || overallProgress < 30) {
      health = 'Critical';
      healthReason = `${blockedMembers.length} active blockers flagged by teammates.`;
    } else if (blockedMembers.length === 1 || overallProgress < 50) {
      health = 'At Risk';
      healthReason = 'Attention required for 1 active blocker or pending role updates.';
    }

    return {
      overallProgress,
      health,
      healthReason,
      totalMembers: memberships.length,
      activeBlockersCount: blockedMembers.length,
      recentUpdatesCount: recentLogs.length,
    };
  }
}
