import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'amber' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  color = 'gradient',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(progress || 0)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillColors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400',
  };

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {showPercentage && <span className="text-indigo-400 font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50', heightStyles[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out shadow-glow', fillColors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
