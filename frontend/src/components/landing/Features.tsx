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
} from 'lucide-react';
import { Card } from '../common/Card';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: FolderGit2,
      title: 'Project Tracking & Access Control',
      description: 'Create multiple projects protected by encrypted passwords. Teammates join seamlessly with permanent authorization.',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: TrendingUp,
      title: 'Role-Based Progress Updates',
      description: 'Select developer roles (Frontend, Backend, ML, DevOps, AI, UI/UX) and record daily completion percentages with blockers.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: MessageSquare,
      title: 'Project-Specific Team Chat',
      description: 'Restricted, high-speed project chat with Socket.IO real-time delivery and polling fallback for seamless communication.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Video,
      title: 'Meeting Scheduling Hub',
      description: 'Schedule Google Meet or Zoom syncs with validated URL links, upcoming agendas, and 1-click meeting join buttons.',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      icon: FileCode2,
      title: 'Docs & Architecture Gallery',
      description: 'Upload project documentation metadata, PDFs, requirement specs, and preview architecture diagrams in visual galleries.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Trophy,
      title: 'Hackathon Deadlines & Countdown',
      description: 'Track hackathon submission deadlines, registration cutoffs, and live pitch presentation dates with countdown indicators.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Packed with Essential Capabilities
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Everything your dev team needs to build, track, and win.
          </p>
          <p className="mt-3 text-slate-400 text-sm">
            Designed specifically for student hackathon squads and independent software teams seeking maximum velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} glass hoverable className="p-6">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${f.bg}`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
