import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import { CONFIG } from './config';

import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import progressRoutes from './routes/progressRoutes';
import chatRoutes from './routes/chatRoutes';
import meetingRoutes from './routes/meetingRoutes';
import documentRoutes from './routes/documentRoutes';
import linkRoutes from './routes/linkRoutes';
import notificationRoutes from './routes/notificationRoutes';
import activityRoutes from './routes/activityRoutes';

import { setupChatSockets } from './sockets/chatSocket';
import { seedDatabase } from './services/seedService';

const app = express();
const server = http.createServer(app);

// Configure CORS
const allowedOrigins = [
  CONFIG.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://*.netlify.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => o === origin || (o.includes('*') && origin.endsWith('.netlify.app')))) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for development convenience
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
if (!fs.existsSync(CONFIG.UPLOAD_DIR)) {
  fs.mkdirSync(CONFIG.UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(CONFIG.UPLOAD_DIR));

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
setupChatSockets(io);

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'Project Progress Tracker API',
    time: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/progress', progressRoutes);
app.use('/api/projects/:projectId/messages', chatRoutes);
app.use('/api/projects/:projectId/meetings', meetingRoutes);
app.use('/api/projects/:projectId/documents', documentRoutes);
app.use('/api/projects/:projectId/links', linkRoutes);
app.use('/api/projects/:projectId/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Check if seed data exists; if not, automatically seed initial demo data
const usersFile = path.join(CONFIG.DATA_DIR, 'users.json');
if (!fs.existsSync(usersFile) || fs.readFileSync(usersFile, 'utf-8').trim() === '[]') {
  seedDatabase().catch((err) => console.error('Failed to initialize seed database:', err));
}

const PORT = process.env.PORT || CONFIG.PORT;

server.listen(PORT, () => {
  console.log(`🚀 Project Progress Tracker Backend running on port ${PORT}`);
  console.log(`📡 CORS allowed for origin: ${CONFIG.FRONTEND_URL}`);
  console.log(`📁 JSON Data Directory: ${CONFIG.DATA_DIR}`);
});
