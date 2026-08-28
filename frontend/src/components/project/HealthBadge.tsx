import React from 'react';
import { Badge } from '../common/Badge';

interface HealthBadgeProps {
  health: 'Healthy' | 'At Risk' | 'Critical';
  reason?: string;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ health, reason }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <Badge status={health} size="md" />
      {reason && <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">({reason})</span>}
    </div>
  );
};
