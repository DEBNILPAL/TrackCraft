import React, { useState, useMemo } from 'react';
import {
  FolderGit2,
  Activity,
  CheckCircle2,
  Users,
  Calendar,
  Trophy,
  Search,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/project/ProjectCard';
import { CreateProjectModal } from '../components/project/CreateProjectModal';
import { PasswordModal } from '../components/project/PasswordModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Project } from '../types';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { projects, isLoading, setLockedProjectToJoin, lockedProjectToJoin } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'Active' || p.status === 'Development').length;
    const completedProjects = projects.filter((p) => p.status === 'Completed').length;
    const joinedProjects = projects.filter((p) => p.isMember).length;
    const hackathonProjects = projects.filter((p) => p.hackathon?.name).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      joinedProjects,
      hackathonProjects,
    };
  }, [projects]);

  // Search & Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.hackathon?.name && p.hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'JOINED' && p.isMember) ||
        (statusFilter === 'HACKATHON' && p.hackathon?.name) ||
        p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 shadow-2xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Developer Progress Workspace</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-100 tracking-tight">
            Welcome back, {user?.fullName || 'Teammate'}! 👋
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-xl">
            Track daily role completion percentages, password-protected team access, real-time chat, and hackathon submission timelines.
          </p>
        </div>

        <Button
          variant="glow"
          size="lg"
          icon={PlusCircle}
          onClick={() => setShowCreateModal(true)}
          className="shrink-0 shadow-glow"
        >
          Create New Project
        </Button>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-100">{metrics.totalProjects}</p>
            <p className="text-xs text-slate-400 font-medium">Total Projects</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-100">{metrics.activeProjects}</p>
            <p className="text-xs text-slate-400 font-medium">Active / In Dev</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-100">{metrics.joinedProjects}</p>
            <p className="text-xs text-slate-400 font-medium">Joined Memberships</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-100">{metrics.hackathonProjects}</p>
            <p className="text-xs text-slate-400 font-medium">Hackathon Entries</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects or hackathons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'JOINED', 'HACKATHON', 'Active', 'Development', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === filter
                  ? 'bg-indigo-600 text-white shadow-glow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'ALL' ? 'All Projects' : filter === 'JOINED' ? 'My Joined' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects found"
          description={
            searchQuery
              ? `No projects matching "${searchQuery}". Try adjusting your search query.`
              : 'You don\'t have any projects yet. Create your first project to get started!'
          }
          actionLabel="Create First Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenPasswordModal={(p) => setLockedProjectToJoin(p)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Password Protection Join Modal */}
      {lockedProjectToJoin && (
        <PasswordModal
          project={lockedProjectToJoin}
          isOpen={!!lockedProjectToJoin}
          onClose={() => setLockedProjectToJoin(null)}
        />
      )}
    </div>
  );
};
