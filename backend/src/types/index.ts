export type UserRole = 
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'ML Developer'
  | 'AI Developer'
  | 'DevOps'
  | 'UI/UX Designer'
  | 'Database Developer'
  | 'Researcher'
  | 'Documentation'
  | 'Project Manager'
  | 'Other';

export type ProjectStatus = 
  | 'Planning'
  | 'Active'
  | 'Development'
  | 'Testing'
  | 'Deployment'
  | 'Completed'
  | 'On Hold';

export type BlockerStatus = 'None' | 'Blocked' | 'Needs Help';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSanitized {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  ai?: string;
  ml?: string;
  deployment?: string;
  other?: string;
}

export interface HackathonInfo {
  name: string;
  organizer?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  submissionDeadline?: string;
  presentationDate?: string;
  resultDate?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  passwordHash: string; // bcrypt hashed project password
  ownerId: string;
  status: ProjectStatus;
  startDate?: string;
  expectedEndDate?: string;
  hackathon?: HackathonInfo;
  techStack?: TechStack;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  currentProgress: number; // 0 - 100
  joinedAt: string;
  updatedAt: string;
}

export interface ProgressLog {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  role: UserRole;
  progressPercentage: number; // 0 - 100
  completedToday: string;
  currentlyWorkingOn: string;
  blockers: string;
  blockerStatus: BlockerStatus;
  nextSteps: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes?: number;
  meetingLink: string;
  agenda: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  name: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  isArchitectureDiagram: boolean;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface ReferenceLink {
  id: string;
  projectId: string;
  title: string;
  url: string;
  description: string;
  category: 'Documentation' | 'GitHub' | 'Research' | 'Dataset' | 'API' | 'Tutorial' | 'Deployment' | 'Other';
  addedBy: string;
  addedByName: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'project_update' | 'meeting' | 'chat' | 'progress' | 'membership';
  projectId?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  action: string; // e.g. "updated progress to 80%", "uploaded architecture diagram"
  details?: string;
  createdAt: string;
}
