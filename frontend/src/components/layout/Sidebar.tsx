import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  FolderPlus,
  Compass,
  X,
  PlusCircle,
  FolderGit2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useProject } from '../../context/ProjectContext';
import { Button } from '../common/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenCreateModal,
}) => {
  const location = useLocation();
  const { projects } = useProject();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Team Chat', path: '/dashboard/chat', icon: MessageSquare },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={clsx(
          'fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div>
          {/* Top Brand Header (Mobile Close Button) */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-800/80 lg:hidden">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-slate-100">TrackCraft</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Create Project Button */}
          <div className="mb-6">
            <Button
              variant="glow"
              size="md"
              icon={PlusCircle}
              onClick={() => {
                onOpenCreateModal();
                onClose();
              }}
              className="w-full justify-center shadow-glow"
            >
              New Project
            </Button>
          </div>

          {/* Main Navigation Section */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Navigation
            </p>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                  )}
                >
                  <Icon className={clsx('w-4 h-4', isActive ? 'text-indigo-400' : 'text-slate-400')} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Projects Quick Access */}
          <div className="mt-8 space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Projects ({projects.length})
              </p>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {projects.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-400 italic">No projects yet</p>
              ) : (
                projects.map((proj) => {
                  const projectPath = `/project/${proj.id}`;
                  const isActive = location.pathname.startsWith(projectPath);
                  return (
                    <NavLink
                      key={proj.id}
                      to={projectPath}
                      onClick={onClose}
                      className={clsx(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group',
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderGit2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{proj.name}</span>
                      </div>
                      {proj.isMember ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          {proj.overallProgress}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                          🔒
                        </span>
                      )}
                    </NavLink>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Hackathon Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 mt-6">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-200">Hackathon Mode</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Track daily role progress & deadlines seamlessly.
          </p>
        </div>
      </aside>
    </>
  );
};
