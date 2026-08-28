import React from 'react';
import {
  FolderGit2,
  Users,
  TrendingUp,
  MessageSquare,
  FileCode2,
  Video,
  ShieldCheck,
  Trophy,
  Database,
  Globe,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../common/Card';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: FolderGit2,
      title: 'Protected Project Workspaces',
      description: 'Create password-protected projects for your squad. Teammates authenticate with project passwords for permanent workspace access.',
      tag: 'Security & Access',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: TrendingUp,
      title: 'Role-Based Daily Progress Stream',
      description: 'Log completion percentages by role (Frontend, Backend, ML, DevOps, AI, UI/UX). Track daily accomplishments and flag blocker issues instantly.',
      tag: 'Velocity & Metrics',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: MessageSquare,
      title: 'Real-Time Team Chat Room',
      description: 'Encrypted project-bound instant chat powered by WebSockets (Socket.IO). Exchange code snippets and status updates in real-time.',
      tag: 'WebSockets Chat',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Database,
      title: 'Persistent JSON Memory Database',
      description: 'All conversations, users, projects, progress logs, meetings, and documents are stored persistently in atomic JSON storage files.',
      tag: 'JSON File DB',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Video,
      title: 'Team Sync & Meeting Scheduling',
      description: 'Schedule Google Meet or Zoom syncs with validated meeting URLs, agendas, created-by badges, and 1-click launch buttons.',
      tag: 'Video Syncs',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      icon: FileCode2,
      title: 'Docs & Architecture Gallery',
      description: 'Upload project document metadata, PDFs, and architecture diagrams into visual lightbox galleries for quick team review.',
      tag: 'Architecture & Specs',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: Trophy,
      title: 'Hackathon Deadlines & Countdowns',
      description: 'Track hackathon submission deadlines, registration cutoffs, and live presentation dates with real-time countdown timers.',
      tag: 'Hackathons',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: Globe,
      title: 'External API & Reference Links',
      description: 'Organize API endpoints, documentation URLs, GitHub repositories, and research datasets with categorized reference bookmarks.',
      tag: 'API & Resources',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Packed with Essential Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything your dev squad needs to build, track, and win.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Designed specifically for student hackathon teams and software developers seeking maximum velocity and full project visibility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} glass hoverable className="p-5 sm:p-6 flex flex-col justify-between h-full group border border-slate-800/80">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center ${f.bg}`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Tech Specs Banner */}
        <div className="mt-12 sm:mt-16 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 glass-panel">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Production-Ready & Fully Persistent</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Every user update, message, and project state is stored atomically in local JSON memory files.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% JSON Database</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Socket.IO WebSockets</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mobile Responsive</span>
          </div>
        </div>
      </div>
    </section>
  );
};
