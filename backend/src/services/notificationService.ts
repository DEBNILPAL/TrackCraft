import { JsonStorage } from '../storage/jsonStorage';
import { NotificationItem, ActivityItem, Membership } from '../types';

const notificationStorage = new JsonStorage<NotificationItem>('notifications');
const activityStorage = new JsonStorage<ActivityItem>('activity');
const membershipStorage = new JsonStorage<Membership>('memberships');

export class NotificationService {
  /**
   * Create a notification item for a specific user
   */
  static createNotification(data: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>): NotificationItem {
    const item: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notificationStorage.insert(item);
    return item;
  }

  /**
   * Notify all members of a project (excluding the user who triggered the action)
   */
  static notifyProjectMembers(
    projectId: string,
    triggerUserId: string,
    title: string,
    message: string,
    type: NotificationItem['type'] = 'project_update'
  ): void {
    const memberships = membershipStorage.filter((m) => m.projectId === projectId);
    memberships.forEach((m) => {
      if (m.userId !== triggerUserId) {
        this.createNotification({
          userId: m.userId,
          title,
          message,
          type,
          projectId,
        });
      }
    });
  }

  /**
   * Get notifications for a user with unread count
   */
  static getUserNotifications(userId: string): { notifications: NotificationItem[]; unreadCount: number } {
    const list = notificationStorage.filter((n) => n.userId === userId);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const unreadCount = list.filter((n) => !n.read).length;
    return { notifications: list.slice(0, 30), unreadCount };
  }

  /**
   * Mark single notification as read
   */
  static markAsRead(id: string): void {
    notificationStorage.update(id, { read: true });
  }

  /**
   * Mark all notifications as read for a user
   */
  static markAllAsRead(userId: string): void {
    const items = notificationStorage.filter((n) => n.userId === userId && !n.read);
    items.forEach((item) => {
      notificationStorage.update(item.id, { read: true });
    });
  }

  /**
   * Get activity timeline for a project
   */
  static getProjectActivity(projectId: string, limit = 50): ActivityItem[] {
    const list = activityStorage.filter((a) => a.projectId === projectId);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list.slice(0, limit);
  }
}
