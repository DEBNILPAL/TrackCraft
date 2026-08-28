import React from 'react';
import { RoleProgressBreakdown } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface RoleProgressListProps {
  breakdown: RoleProgressBreakdown[];
}

export const RoleProgressList: React.FC<RoleProgressListProps> = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) {
    return <p className="text-xs text-slate-400 italic">No role assignments recorded.</p>;
  }

  return (
    <div className="space-y-4">
      {breakdown.map((item, idx) => (
        <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-slate-100">{item.role}</span>
              <span className="ml-2 text-[10px] text-slate-400">({item.members.join(', ')})</span>
            </div>
            <span className="font-extrabold text-indigo-400">{item.avgProgress}%</span>
          </div>
          <ProgressBar progress={item.avgProgress} showPercentage={false} size="sm" />
        </div>
      ))}
    </div>
  );
};
