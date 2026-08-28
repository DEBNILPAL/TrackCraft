import bcrypt from 'bcryptjs';
import { JsonStorage } from '../storage/jsonStorage';
import { Project, Membership, UserRole, ProjectStatus, UserSanitized, TechStack, HackathonInfo } from '../types';
import { AuthService } from './authService';
import { NotificationService } from './notificationService';

const projectStorage = new JsonStorage<Project>('projects');
const membershipStorage = new JsonStorage<Membership>('memberships');

export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(
    owner: UserSanitized,
    data: {
      name: string;
      description: string;
      password: string;
      status?: ProjectStatus;
      startDate?: string;
      expectedEndDate?: string;
      hackathon?: HackathonInfo;
      techStack?: TechStack;
      logoUrl?: string;
      ownerRole?: UserRole;
    }
  ): Promise<{ project: Omit<Project, 'passwordHash'>; membership: Membership }> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newProject: Project = {
      id: projectId,
      name: data.name.trim(),
      description: data.description.trim(),
      passwordHash,
      ownerId: owner.id,
      status: data.status || 'Active',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      expectedEndDate: data.expectedEndDate || '',
      hackathon: data.hackathon,
      techStack: data.techStack,
      logoUrl: data.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name.trim())}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projectStorage.insert(newProject);

    // Creator automatically becomes a Project Member and Project Owner
    const membership: Membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId: owner.id,
      role: data.ownerRole || 'Project Manager',
      currentProgress: 0,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    membershipStorage.insert(membership);

    const { passwordHash: _, ...sanitizedProject } = newProject;
    return { project: sanitizedProject, membership };
  }

  /**
   * Get all projects with user membership indicators
   */
  static getAllProjects(userId?: string): Array<{
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
  }> {
    const projects = projectStorage.getAll();
    const memberships = membershipStorage.getAll();

    return projects.map((proj) => {
      const projMemberships = memberships.filter((m) => m.projectId === proj.id);
      const isMember = userId ? projMemberships.some((m) => m.userId === userId) : false;
      const isOwner = userId ? proj.ownerId === userId : false;

      // Calculate average progress across team members
      const overallProgress = projMemberships.length > 0
        ? Math.round(projMemberships.reduce((acc, m) => acc + (m.currentProgress || 0), 0) / projMemberships.length)
        : 0;

      const { passwordHash, ...rest } = proj;

      return {
        ...rest,
        memberCount: projMemberships.length,
        overallProgress,
        isMember,
        isOwner,
      };
    });
  }

  /**
   * Get Project Details by ID (if user is a member or owner)
   */
  static getProjectById(projectId: string, userId: string) {
    const proj = projectStorage.getById(projectId);
    if (!proj) return null;

    const memberships = membershipStorage.filter((m) => m.projectId === projectId);
    const isMember = memberships.some((m) => m.userId === userId);
    const isOwner = proj.ownerId === userId;

    const overallProgress = memberships.length > 0
      ? Math.round(memberships.reduce((acc, m) => acc + (m.currentProgress || 0), 0) / memberships.length)
      : 0;

    const { passwordHash, ...sanitized } = proj;

    return {
      ...sanitized,
      memberCount: memberships.length,
      overallProgress,
      isMember,
      isOwner,
    };
  }

  /**
   * Verify Project Password and Join Project
   */
  static async joinProjectWithPassword(
    projectId: string,
    userId: string,
    passwordAttempt: string,
    role: UserRole = 'Frontend Developer'
  ): Promise<Membership> {
    const proj = projectStorage.getById(projectId);
    if (!proj) {
      throw new Error('Project not found');
    }

    // Check if already a member
    const existing = membershipStorage.filter((m) => m.projectId === projectId && m.userId === userId);
    if (existing.length > 0) {
      return existing[0];
    }

    // Verify password
    const isMatch = await bcrypt.compare(passwordAttempt, proj.passwordHash);
    if (!isMatch) {
      throw new Error('Incorrect project password. Access denied.');
    }

    // Password correct -> Create permanent membership
    const membership: Membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      userId,
      role,
      currentProgress: 0,
      joinedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    membershipStorage.insert(membership);

    // Notify project members about the new teammate
    const user = AuthService.getUserById(userId);
    NotificationService.notifyProjectMembers(
      projectId,
      userId,
      'New Teammate Joined',
      `${user?.fullName || 'A new teammate'} joined ${proj.name} as ${role}.`,
      'membership'
    );

    return membership;
  }

  /**
   * Check if user is member of project
   */
  static isUserMember(projectId: string, userId: string): boolean {
    const members = membershipStorage.filter((m) => m.projectId === projectId && m.userId === userId);
    return members.length > 0;
  }

  /**
   * Get project members with user info
   */
  static getProjectMembers(projectId: string) {
    const memberships = membershipStorage.filter((m) => m.projectId === projectId);
    return memberships.map((m) => {
      const user = AuthService.getUserById(m.userId);
      return {
        ...m,
        user: user || {
          id: m.userId,
          fullName: 'Unknown User',
          email: '',
          avatarUrl: '',
        },
      };
    });
  }

  /**
   * Update member role in project
   */
  static updateMemberRole(projectId: string, userId: string, newRole: UserRole): Membership {
    const memberships = membershipStorage.filter((m) => m.projectId === projectId && m.userId === userId);
    if (memberships.length === 0) {
      throw new Error('Membership not found');
    }

    const updated = membershipStorage.update(memberships[0].id, {
      role: newRole,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) throw new Error('Failed to update member role');
    return updated;
  }

  /**
   * Update Project Details (Owner only)
   */
  static updateProject(projectId: string, userId: string, updates: Partial<Project>): Omit<Project, 'passwordHash'> {
    const proj = projectStorage.getById(projectId);
    if (!proj) throw new Error('Project not found');
    if (proj.ownerId !== userId) throw new Error('Only the project owner can update project details');

    const updated = projectStorage.update(projectId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) throw new Error('Failed to update project');

    const { passwordHash, ...sanitized } = updated;
    return sanitized;
  }
}
