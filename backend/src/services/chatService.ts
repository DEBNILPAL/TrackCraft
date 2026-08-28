import { JsonStorage } from '../storage/jsonStorage';
import { ChatMessage, UserSanitized } from '../types';

const chatStorage = new JsonStorage<ChatMessage>('messages');

export class ChatService {
  /**
   * Post a new chat message
   */
  static sendMessage(user: UserSanitized, projectId: string, content: string): ChatMessage {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error('Message content cannot be empty');
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: user.id,
      userName: user.fullName,
      userAvatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}`,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    chatStorage.insert(message);
    return message;
  }

  /**
   * Get messages for a project
   */
  static getProjectMessages(projectId: string, limit = 100): ChatMessage[] {
    const messages = chatStorage.filter((m) => m.projectId === projectId);
    // Sort chronologically (oldest first for chat display)
    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return messages.slice(-limit);
  }

  /**
   * Delete own message
   */
  static deleteMessage(messageId: string, userId: string): boolean {
    const msg = chatStorage.getById(messageId);
    if (!msg) return false;
    if (msg.userId !== userId) {
      throw new Error('You can only delete your own messages');
    }
    return chatStorage.delete(messageId);
  }
}
