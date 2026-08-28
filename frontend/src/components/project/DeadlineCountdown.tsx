import React, { useState, useEffect } from 'react';
import { Clock, Trophy, AlertCircle } from 'lucide-react';
import { HackathonInfo } from '../../types';

interface DeadlineCountdownProps {
  hackathon?: HackathonInfo;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({ hackathon }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!hackathon?.submissionDeadline && !hackathon?.endDate) return;

    const deadlineStr = hackathon.submissionDeadline || hackathon.endDate;
    const targetDate = new Date(deadlineStr!).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsPast(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hackathon]);

  if (!hackathon?.name) return null;

  return (
    <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 glass-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">{hackathon.name}</h4>
            <p className="text-[11px] text-purple-300">Submission Deadline</p>
          </div>
        </div>
        <Clock className="w-5 h-5 text-purple-400 animate-pulse" />
      </div>

      {isPast ? (
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4" /> Hackathon submission period ended.
        </div>
      ) : timeLeft ? (
        <div className="grid grid-cols-4 gap-2 text-center pt-1">
          <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <span className="text-xl font-extrabold text-white">{timeLeft.days}</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Days</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <span className="text-xl font-extrabold text-white">{timeLeft.hours}</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Hours</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <span className="text-xl font-extrabold text-white">{timeLeft.minutes}</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Mins</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
            <span className="text-xl font-extrabold text-indigo-400">{timeLeft.seconds}</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Secs</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
