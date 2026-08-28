import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = true,
  hoverable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl p-5 border transition-all duration-200',
        glass ? 'glass-card' : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl',
        hoverable && 'hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
