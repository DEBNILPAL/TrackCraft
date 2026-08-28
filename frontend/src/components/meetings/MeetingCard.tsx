import React from 'react';
import { Video, Calendar, Clock, ExternalLink, User } from 'lucide-react';
import { Meeting } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface MeetingCardProps {
  meeting: Meeting;
  isPast?: boolean;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isPast = false }) => {
  const formattedDate = new Date(`${meeting.date}T${meeting.time || '00:00'}`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card glass className={`p-5 flex flex-col justify-between ${isPast ? 'opacity-60 border-slate-800' : 'border-indigo-500/30 shadow-glow'}`}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPast ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{meeting.title}</h4>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-400" /> By {meeting.createdByName}
              </p>
            </div>
          </div>
          {isPast ? (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">Past</span>
          ) : (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">Upcoming</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{meeting.time} ({meeting.durationMinutes || 45}m)</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 italic">
          "{meeting.agenda}"
        </p>
      </div>

      <a
        href={meeting.meetingLink}
        target="_blank"
        rel="noreferrer"
        className="w-full"
      >
        <Button
          variant={isPast ? 'secondary' : 'glow'}
          size="sm"
          icon={ExternalLink}
          iconPosition="right"
          className="w-full justify-center"
        >
          {isPast ? 'View Meeting Link' : 'Join Meeting'}
        </Button>
      </a>
    </Card>
  );
};
