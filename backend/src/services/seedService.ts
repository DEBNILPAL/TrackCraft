import bcrypt from 'bcryptjs';
import { JsonStorage } from '../storage/jsonStorage';
import { User, Project, Membership, ProgressLog, ChatMessage, Meeting, DocumentItem, ReferenceLink, ActivityItem } from '../types';

export async function seedDatabase() {
  console.log('🌱 Starting JSON Storage Seeding Process...');

  const userStorage = new JsonStorage<User>('users');
  const projectStorage = new JsonStorage<Project>('projects');
  const membershipStorage = new JsonStorage<Membership>('memberships');
  const progressStorage = new JsonStorage<ProgressLog>('progress');
  const chatStorage = new JsonStorage<ChatMessage>('messages');
  const meetingStorage = new JsonStorage<Meeting>('meetings');
  const documentStorage = new JsonStorage<DocumentItem>('documents');
  const linkStorage = new JsonStorage<ReferenceLink>('links');
  const activityStorage = new JsonStorage<ActivityItem>('activity');

  // Reset collections
  userStorage.saveAll([]);
  projectStorage.saveAll([]);
  membershipStorage.saveAll([]);
  progressStorage.saveAll([]);
  chatStorage.saveAll([]);
  meetingStorage.saveAll([]);
  documentStorage.saveAll([]);
  linkStorage.saveAll([]);
  activityStorage.saveAll([]);

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const projPasswordHash = await bcrypt.hash('hackathon2026', 10);

  // 1. Create Users
  const userDebnil: User = {
    id: 'user_debnil_01',
    fullName: 'Debnil Paul',
    email: 'debnil@example.com',
    phone: '+1 555 0192',
    passwordHash: defaultPasswordHash,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Debnil',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const userRahul: User = {
    id: 'user_rahul_02',
    fullName: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+1 555 0184',
    passwordHash: defaultPasswordHash,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const userAnanya: User = {
    id: 'user_ananya_03',
    fullName: 'Ananya Gupta',
    email: 'ananya@example.com',
    phone: '+1 555 0133',
    passwordHash: defaultPasswordHash,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  userStorage.insert(userDebnil);
  userStorage.insert(userRahul);
  userStorage.insert(userAnanya);

  // 2. Create Project 1: Smart AI Assistant (Protected)
  const proj1: Project = {
    id: 'proj_smart_ai_01',
    name: 'Smart AI Assistant Hub',
    description: 'Autonomous multi-agent assistant suite built for real-time query resolution and team workflow automation.',
    passwordHash: projPasswordHash, // Password: hackathon2026
    ownerId: userDebnil.id,
    status: 'Development',
    startDate: '2026-08-20',
    expectedEndDate: '2026-09-05',
    hackathon: {
      name: 'Global AI Innovators Hackathon 2026',
      organizer: 'TechCorp International',
      startDate: '2026-08-25',
      endDate: '2026-08-30',
      registrationDeadline: '2026-08-24',
      submissionDeadline: '2026-08-30T18:00:00Z',
      presentationDate: '2026-08-31',
      notes: 'Final presentation requires 3-minute video pitch and live GitHub repository link.',
    },
    techStack: {
      frontend: 'React + TypeScript + Tailwind CSS',
      backend: 'Node.js + Express + Socket.IO',
      ai: 'Gemini 1.5 Pro API',
      database: 'JSON Atomic Filesystem Storage',
      deployment: 'Netlify + Render',
    },
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SmartAIAssistant',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Create Project 2: Cloud Logistics Tracker
  const proj2: Project = {
    id: 'proj_cloud_logistics_02',
    name: 'Cloud Logistics Tracker',
    description: 'Real-time supply chain monitoring platform featuring automated route recalculation and IoT sensor telemetry.',
    passwordHash: projPasswordHash,
    ownerId: userRahul.id,
    status: 'Active',
    startDate: '2026-08-15',
    expectedEndDate: '2026-09-20',
    techStack: {
      frontend: 'Vite React',
      backend: 'Express Microservices',
      database: 'Redis + JSON',
      deployment: 'Render Cloud Platform',
    },
    logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=CloudLogistics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projectStorage.insert(proj1);
  projectStorage.insert(proj2);

  // 3. Memberships
  const memDebnil: Membership = {
    id: 'mem_01',
    projectId: proj1.id,
    userId: userDebnil.id,
    role: 'Frontend Developer',
    currentProgress: 80,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const memRahul: Membership = {
    id: 'mem_02',
    projectId: proj1.id,
    userId: userRahul.id,
    role: 'Backend Developer',
    currentProgress: 65,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const memAnanya: Membership = {
    id: 'mem_03',
    projectId: proj1.id,
    userId: userAnanya.id,
    role: 'ML Developer',
    currentProgress: 50,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const memRahulProj2: Membership = {
    id: 'mem_04',
    projectId: proj2.id,
    userId: userRahul.id,
    role: 'Project Manager',
    currentProgress: 40,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  membershipStorage.insert(memDebnil);
  membershipStorage.insert(memRahul);
  membershipStorage.insert(memAnanya);
  membershipStorage.insert(memRahulProj2);

  // 4. Progress Logs
  progressStorage.insert({
    id: 'prog_01',
    projectId: proj1.id,
    userId: userDebnil.id,
    userName: userDebnil.fullName,
    role: 'Frontend Developer',
    progressPercentage: 80,
    completedToday: 'Completed glassmorphic dashboard components, project password prompt modal, and role progress bars.',
    currentlyWorkingOn: 'Integrating real-time Socket.IO chat UI widget.',
    blockers: 'None',
    blockerStatus: 'None',
    nextSteps: 'Finalize settings page and dark theme toggle animations.',
    date: '2026-08-28',
    createdAt: new Date().toISOString(),
  });

  progressStorage.insert({
    id: 'prog_02',
    projectId: proj1.id,
    userId: userRahul.id,
    userName: userRahul.fullName,
    role: 'Backend Developer',
    progressPercentage: 65,
    completedToday: 'Implemented atomic JSON file locking repository and Express JWT auth routes.',
    currentlyWorkingOn: 'Optimizing Socket.IO fallback handlers for Render backend deployment.',
    blockers: 'CORS header verification on cross-domain preflight options.',
    blockerStatus: 'Needs Help',
    nextSteps: 'Verify Multer file upload limits for PDF architecture files.',
    date: '2026-08-28',
    createdAt: new Date().toISOString(),
  });

  // 5. Chat Messages
  chatStorage.insert({
    id: 'msg_01',
    projectId: proj1.id,
    userId: userDebnil.id,
    userName: userDebnil.fullName,
    userAvatar: userDebnil.avatarUrl,
    content: 'Hey team! I just updated the frontend progress to 80%. Password protection modal works smoothly.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  });

  chatStorage.insert({
    id: 'msg_02',
    projectId: proj1.id,
    userId: userRahul.id,
    userName: userRahul.fullName,
    userAvatar: userRahul.avatarUrl,
    content: 'Great job Debnil! The REST API routes for role progress breakdowns and meetings are online.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  });

  chatStorage.insert({
    id: 'msg_03',
    projectId: proj1.id,
    userId: userAnanya.id,
    userName: userAnanya.fullName,
    userAvatar: userAnanya.avatarUrl,
    content: 'Awesome! I uploaded our system architecture diagram PDF in the Docs tab for review.',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  });

  // 6. Meetings
  meetingStorage.insert({
    id: 'meet_01',
    projectId: proj1.id,
    title: 'Hackathon Mid-Way Sync & Demo Review',
    date: '2026-08-29',
    time: '19:30',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    agenda: 'Review completed features, test password join flow, and assign final pitch presentation roles.',
    createdBy: userDebnil.id,
    createdByName: userDebnil.fullName,
    createdAt: new Date().toISOString(),
  });

  // 7. Documents & Architecture
  documentStorage.insert({
    id: 'doc_arch_01',
    projectId: proj1.id,
    name: 'Smart Assistant System Architecture Diagram',
    description: 'High-level component flow diagram depicting React SPA frontend communicating with Express REST API and JSON atomic persistence layer.',
    fileUrl: 'https://raw.githubusercontent.com/mermaid-js/mermaid/develop/docs/img/header-bg.png',
    fileType: 'image/png',
    fileSize: 452000,
    isArchitectureDiagram: true,
    uploadedBy: userAnanya.id,
    uploadedByName: userAnanya.fullName,
    uploadedAt: new Date().toISOString(),
  });

  documentStorage.insert({
    id: 'doc_manual_02',
    projectId: proj1.id,
    name: 'Project Requirement Specifications & API Contracts.pdf',
    description: 'Comprehensive specifications detailing endpoint signatures, JSON schemas, and authorization rules.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'application/pdf',
    fileSize: 1240000,
    isArchitectureDiagram: false,
    uploadedBy: userDebnil.id,
    uploadedByName: userDebnil.fullName,
    uploadedAt: new Date().toISOString(),
  });

  // 8. Reference Links
  linkStorage.insert({
    id: 'link_01',
    projectId: proj1.id,
    title: 'Gemini API Reference Documentation',
    url: 'https://ai.google.dev/docs',
    description: 'Official API reference guide for Google Gemini model integration.',
    category: 'API',
    addedBy: userDebnil.id,
    addedByName: userDebnil.fullName,
    createdAt: new Date().toISOString(),
  });

  linkStorage.insert({
    id: 'link_02',
    projectId: proj1.id,
    title: 'GitHub Project Repository',
    url: 'https://github.com/example/project-progress-tracker',
    description: 'Team GitHub monorepo containing frontend and backend code.',
    category: 'GitHub',
    addedBy: userRahul.id,
    addedByName: userRahul.fullName,
    createdAt: new Date().toISOString(),
  });

  // 9. Activity Items
  activityStorage.insert({
    id: 'act_01',
    projectId: proj1.id,
    userId: userDebnil.id,
    userName: userDebnil.fullName,
    action: 'created project "Smart AI Assistant Hub"',
    details: 'Project initial status set to Development.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  });

  activityStorage.insert({
    id: 'act_02',
    projectId: proj1.id,
    userId: userRahul.id,
    userName: userRahul.fullName,
    action: 'joined project using project password',
    details: 'Assigned role: Backend Developer.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  });

  activityStorage.insert({
    id: 'act_03',
    projectId: proj1.id,
    userId: userDebnil.id,
    userName: userDebnil.fullName,
    action: 'updated Frontend progress to 80%',
    details: 'Completed password prompt modal and glassmorphism styling.',
    createdAt: new Date().toISOString(),
  });

  console.log('✅ JSON Storage Seeding Complete! Demo accounts:');
  console.log('   1. debnil@example.com / password123 (Project Owner)');
  console.log('   2. rahul@example.com / password123 (Project Member)');
  console.log('   3. ananya@example.com / password123 (Project Member)');
  console.log('   🔑 Project Password for "Smart AI Assistant Hub": hackathon2026');
}

// Execute directly if run via CLI `ts-node src/services/seedService.ts`
if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
  });
}
