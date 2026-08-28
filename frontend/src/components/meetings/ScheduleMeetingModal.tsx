import React, { useState } from 'react';
import { Video, Calendar, Link as LinkIcon, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

interface ScheduleMeetingModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  projectId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [meetingLink, setMeetingLink] = useState('');
  const [agenda, setAgenda] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !meetingLink || !agenda) {
      setError('Title, Meeting Link, and Agenda are required');
      return;
    }

    if (!meetingLink.startsWith('http://') && !meetingLink.startsWith('https://')) {
      setError('Please enter a valid meeting link starting with http:// or https://');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post(`/projects/${projectId}/meetings`, {
        title,
        date,
        time,
        meetingLink,
        agenda,
        durationMinutes,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Team Meeting"
      subtitle="Paste Google Meet or Zoom link for project sync"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Meeting Title *"
          placeholder="e.g. Hackathon Mid-Way Sync & Demo Review"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time *"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <Input
          label="Google Meet / Zoom URL *"
          placeholder="https://meet.google.com/abc-defg-hij"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          icon={<LinkIcon className="w-4 h-4" />}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Agenda / Discussion Points *
          </label>
          <textarea
            rows={3}
            placeholder="Review completed backend REST endpoints and test UI integration..."
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={Video}>
            Schedule Sync
          </Button>
        </div>
      </form>
    </Modal>
  );
};
