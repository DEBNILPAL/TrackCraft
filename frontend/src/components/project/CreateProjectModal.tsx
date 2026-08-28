import React, { useState } from 'react';
import { FolderPlus, KeyRound, Trophy, Layers } from 'lucide-react';
import { ProjectStatus, UserRole } from '../../types';
import { useProject } from '../../context/ProjectContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { fetchProjects } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [ownerRole, setOwnerRole] = useState<UserRole>('Project Manager');

  // Hackathon optional fields
  const [isHackathon, setIsHackathon] = useState(false);
  const [hackathonName, setHackathonName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [presentationDate, setPresentationDate] = useState('');

  // Tech stack
  const [frontendStack, setFrontendStack] = useState('');
  const [backendStack, setBackendStack] = useState('');
  const [aiStack, setAiStack] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !password) {
      setError('Project Name, Description, and Password are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Project passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/projects', {
        name,
        description,
        password,
        confirmPassword,
        status,
        startDate,
        expectedEndDate,
        ownerRole,
        hackathon: isHackathon
          ? {
              name: hackathonName,
              organizer,
              submissionDeadline,
              presentationDate,
            }
          : undefined,
        techStack: {
          frontend: frontendStack,
          backend: backendStack,
          ai: aiStack,
        },
      });

      if (res.data.success) {
        await fetchProjects();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      subtitle="Initialize a new team project with password protection"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Project Name *"
          placeholder="e.g. Smart AI Assistant Hub"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Project Description *
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe project objectives, core features, and goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project Password *"
            type="password"
            placeholder="Set project password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<KeyRound className="w-4 h-4" />}
            required
          />
          <Input
            label="Confirm Password *"
            type="password"
            placeholder="Confirm password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<KeyRound className="w-4 h-4" />}
            required
          />
        </div>

        {/* Roles & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Development">Development</option>
              <option value="Testing">Testing</option>
              <option value="Deployment">Deployment</option>
            </select>
          </div>

          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Target End Date"
            type="date"
            value={expectedEndDate}
            onChange={(e) => setExpectedEndDate(e.target.value)}
          />
        </div>

        {/* Hackathon Details Checkbox & Fields */}
        <div className="pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-400">
            <input
              type="checkbox"
              checked={isHackathon}
              onChange={(e) => setIsHackathon(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <Trophy className="w-4 h-4" /> This project is for a Hackathon
          </label>

          {isHackathon && (
            <div className="mt-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Hackathon Name"
                  placeholder="e.g. AI Innovators 2026"
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                />
                <Input
                  label="Organizing Body"
                  placeholder="e.g. TechCorp"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Submission Deadline"
                  type="datetime-local"
                  value={submissionDeadline}
                  onChange={(e) => setSubmissionDeadline(e.target.value)}
                />
                <Input
                  label="Presentation Date"
                  type="date"
                  value={presentationDate}
                  onChange={(e) => setPresentationDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={FolderPlus}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
