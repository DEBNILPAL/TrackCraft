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
  ownerId: string;
  status: ProjectStatus;
  startDate?: string;
  expectedEndDate?: string;
  hackathon?: HackathonInfo;
  techStack?: TechStack;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  overallProgress: number;
  isMember: boolean;
  isOwner: boolean;
}

export interface Membership {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  currentProgress: number;
  joinedAt: string;
  updatedAt: string;
  user?: User;
}

export interface ProgressLog {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  role: UserRole;
  progressPercentage: number;
  completedToday: string;
  currentlyWorkingOn: string;
  blockers: string;
  blockerStatus: BlockerStatus;
  nextSteps: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface RoleProgressBreakdown {
  role: string;
  count: number;
  avgProgress: number;
  members: string[];
}

export interface ProjectHealthSummary {
  overallProgress: number;
  health: 'Healthy' | 'At Risk' | 'Critical';
  healthReason: string;
  totalMembers: number;
  activeBlockersCount: number;
  recentUpdatesCount: number;
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
  date: string;
  time: string;
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
  action: string;
  details?: string;
  createdAt: string;
}
