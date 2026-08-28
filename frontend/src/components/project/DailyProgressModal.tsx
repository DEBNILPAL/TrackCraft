import React, { useState } from 'react';
import { Activity, Send, AlertTriangle } from 'lucide-react';
import { UserRole, BlockerStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

interface DailyProgressModalProps {
  projectId: string;
  currentRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DailyProgressModal: React.FC<DailyProgressModalProps> = ({
  projectId,
  currentRole,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [role, setRole] = useState<UserRole>(currentRole || 'Frontend Developer');
  const [progressPercentage, setProgressPercentage] = useState<number>(75);
  const [completedToday, setCompletedToday] = useState('');
  const [currentlyWorkingOn, setCurrentlyWorkingOn] = useState('');
  const [blockers, setBlockers] = useState('');
  const [blockerStatus, setBlockerStatus] = useState<BlockerStatus>('None');
  const [nextSteps, setNextSteps] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles: UserRole[] = [
    'Frontend Developer',
    'Backend Developer',
    'ML Developer',
    'AI Developer',
    'DevOps',
    'UI/UX Designer',
    'Database Developer',
    'Researcher',
    'Documentation',
    'Project Manager',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedToday || !currentlyWorkingOn) {
      setError('Please fill in "Completed Today" and "Currently Working On"');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post(`/projects/${projectId}/progress`, {
        role,
        progressPercentage,
        completedToday,
        currentlyWorkingOn,
        blockers,
        blockerStatus,
        nextSteps,
        notes,
        date,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit daily progress update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Progress Update"
      subtitle="Log your daily role achievements and completion percentage"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Your Role in Project
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Log Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Slider for percentage */}
        <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider">Role Progress Percentage</span>
            <span className="text-xl text-indigo-400 font-extrabold">{progressPercentage}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progressPercentage}
            onChange={(e) => setProgressPercentage(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0% (Planning)</span>
            <span>50% (In Progress)</span>
            <span>100% (Done)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            What I Completed Today *
          </label>
          <textarea
            rows={2}
            placeholder="- Built login UI components&#10;- Resolved API CORS middleware issue"
            value={completedToday}
            onChange={(e) => setCompletedToday(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Currently Working On *
          </label>
          <textarea
            rows={2}
            placeholder="Integrating Socket.IO real-time chat widget..."
            value={currentlyWorkingOn}
            onChange={(e) => setCurrentlyWorkingOn(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Blockers & Next Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Blocker Flag
            </label>
            <select
              value={blockerStatus}
              onChange={(e) => setBlockerStatus(e.target.value as BlockerStatus)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="None">None (Smooth progress)</option>
              <option value="Needs Help">Needs Help (Assistance requested)</option>
              <option value="Blocked">Blocked (Development halted)</option>
            </select>
          </div>

          <Input
            label="Blocker Details (Optional)"
            placeholder="Describe issue..."
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
          />
        </div>

        <Input
          label="Next Working Session Plan"
          placeholder="e.g. Write integration test suite..."
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={Send}>
            Submit Daily Progress
          </Button>
        </div>
      </form>
    </Modal>
  );
};
