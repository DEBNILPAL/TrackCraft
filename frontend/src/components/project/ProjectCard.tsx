import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, Users, Calendar, Trophy, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';

interface ProjectCardProps {
  project: Project;
  onOpenPasswordModal: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenPasswordModal }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (project.isMember) {
      navigate(`/project/${project.id}`);
    } else {
      onOpenPasswordModal(project);
    }
  };

  return (
    <Card glass hoverable className="flex flex-col justify-between p-6 h-full relative group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <Badge status={project.status} size="sm" />
          {project.isMember ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Joined
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shadow-glow">
              <Lock className="w-3.5 h-3.5" /> Protected Project
            </span>
          )}
        </div>

        {/* Project Header & Icon */}
        <div className="flex items-start gap-3.5 mb-3">
          <img
            src={project.logoUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(project.name)}`}
            alt={project.name}
            className="w-12 h-12 rounded-2xl border border-slate-700 bg-slate-800 p-1 shrink-0 shadow-md"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
              {project.name}
            </h3>
            {project.hackathon?.name && (
              <p className="text-xs font-medium text-purple-400 flex items-center gap-1 mt-0.5">
                <Trophy className="w-3 h-3" /> {project.hackathon.name}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-5 leading-relaxed">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-5">
          <ProgressBar progress={project.overallProgress} label="Overall Completion" size="md" />
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> {project.memberCount} Members
          </span>
          {project.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {project.startDate}
            </span>
          )}
        </div>

        <Button
          variant={project.isMember ? 'glow' : 'outline'}
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
          onClick={handleCardClick}
        >
          {project.isMember ? 'Open' : 'Enter Password'}
        </Button>
      </div>
    </Card>
  );
};
