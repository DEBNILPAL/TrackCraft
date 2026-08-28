import React from 'react';
import { Badge } from '../common/Badge';

interface HealthBadgeProps {
  health: 'Healthy' | 'At Risk' | 'Critical';
  reason?: string;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ health, reason }) => {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2">
      <Badge status={health} size="sm" />
      {reason && <span className="text-[11px] sm:text-xs text-slate-400 font-medium hidden md:inline-block">({reason})</span>}
    </div>
  );
};
