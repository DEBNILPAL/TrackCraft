import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';
import { AuthService } from '../services/authService';
import { ProjectService } from '../services/projectService';
import { ChatService } from '../services/chatService';

export function setupChatSockets(io: Server) {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required for WebSocket connection'));
    }

    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as { id: string; email: string };
      const user = AuthService.getUserById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      (socket as any).user = user;
      next();
    } catch (err) {
      return next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    // console.log(`⚡ WebSocket client connected: ${user.fullName} (${socket.id})`);

    // Join Project Chat Room
    socket.on('join_project_room', ({ projectId }: { projectId: string }) => {
      if (!projectId) return;

      // Verify membership before allowing user into chat room
      const isMember = ProjectService.isUserMember(projectId, user.id);
      if (!isMember) {
        socket.emit('error_message', { message: 'Access Denied: You are not a member of this project chat.' });
        return;
      }

      const roomName = `project_${projectId}`;
      socket.join(roomName);
      // console.log(`👥 ${user.fullName} joined room: ${roomName}`);
    });

    // Leave Project Room
    socket.on('leave_project_room', ({ projectId }: { projectId: string }) => {
      if (projectId) {
        socket.leave(`project_${projectId}`);
      }
    });

    // Send Real-time Chat Message
    socket.on('send_chat_message', ({ projectId, content }: { projectId: string; content: string }) => {
      try {
        if (!projectId || !content || !content.trim()) return;

        // Enforce membership authorization
        const isMember = ProjectService.isUserMember(projectId, user.id);
        if (!isMember) {
          socket.emit('error_message', { message: 'Cannot send message: Not a project member.' });
          return;
        }

        const message = ChatService.sendMessage(user, projectId, content);

        // Broadcast to all sockets in the project room
        io.to(`project_${projectId}`).emit('new_chat_message', message);
      } catch (error: any) {
        socket.emit('error_message', { message: error.message || 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      // console.log(`Client disconnected: ${socket.id}`);
    });
  });
}
