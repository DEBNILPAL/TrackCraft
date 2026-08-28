import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  joinProject: (projectId: string, password: string, role?: string) => Promise<boolean>;
  setActiveProject: (project: Project | null) => void;
  // Password modal trigger state
  lockedProjectToJoin: Project | null;
  setLockedProjectToJoin: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lockedProjectToJoin, setLockedProjectToJoin] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProjectById = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const res = await api.get(`/projects/${id}`);
      if (res.data.success) {
        setActiveProject(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err: any) {
      console.error('Fetch project detail error:', err);
      return null;
    }
  }, []);

  const joinProject = async (projectId: string, password: string, role = 'Frontend Developer'): Promise<boolean> => {
    try {
      const res = await api.post(`/projects/${projectId}/join`, { password, role });
      if (res.data.success) {
        await fetchProjects();
        await fetchProjectById(projectId);
        setLockedProjectToJoin(null);
        return true;
      }
      return false;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Incorrect project password');
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        isLoading,
        error,
        fetchProjects,
        fetchProjectById,
        joinProject,
        setActiveProject,
        lockedProjectToJoin,
        setLockedProjectToJoin,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
