import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { Project, UserRole } from '../../types';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface PasswordModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ project, isOpen, onClose }) => {
  const { joinProject } = useProject();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Frontend Developer');
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
    if (!password) {
      setError('Please enter the project password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await joinProject(project.id, password, role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Incorrect project password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Protected Project Access"
      subtitle={`Enter password to join "${project.name}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
          <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-200">
            <p className="font-bold">Password Required</p>
            <p className="mt-0.5">
              This project is protected by a project password. Once verified, your membership will be saved permanently.
            </p>
          </div>
        </div>

        <Input
          label="Project Password"
          type="password"
          placeholder="Enter project password..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          icon={<KeyRound className="w-4 h-4" />}
          error={error}
          autoFocus
        />

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Select Your Role in this Project
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={ShieldCheck}>
            Join Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
