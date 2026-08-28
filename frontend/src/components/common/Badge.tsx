import React from 'react';
import { clsx } from 'clsx';
import { ProjectStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  status?: ProjectStatus | 'Healthy' | 'At Risk' | 'Critical' | 'Blocked' | 'Needs Help' | 'None';
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  variant,
  size = 'md',
  dot = true,
  className,
}) => {
  let resolvedVariant = variant || 'indigo';

  if (status) {
    switch (status) {
      case 'Active':
      case 'Development':
      case 'Healthy':
        resolvedVariant = 'emerald';
        break;
      case 'Planning':
      case 'Testing':
        resolvedVariant = 'sky';
        break;
      case 'Deployment':
        resolvedVariant = 'purple';
        break;
      case 'Completed':
        resolvedVariant = 'emerald';
        break;
      case 'At Risk':
      case 'Needs Help':
      case 'On Hold':
        resolvedVariant = 'amber';
        break;
      case 'Critical':
      case 'Blocked':
        resolvedVariant = 'rose';
        break;
      default:
        resolvedVariant = 'slate';
    }
  }

  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const dotColors = {
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    slate: 'bg-slate-400',
    sky: 'bg-sky-400',
    purple: 'bg-purple-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        sizeStyles[size],
        variantStyles[resolvedVariant],
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[resolvedVariant])} />}
      <span>{children || status}</span>
    </span>
  );
};
