import React, { useState } from 'react';
import { Link as LinkIcon, Plus } from 'lucide-react';
import { ReferenceLink } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

interface AddLinkModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ projectId, isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReferenceLink['category']>('Documentation');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories: ReferenceLink['category'][] = [
    'Documentation',
    'GitHub',
    'Research',
    'Dataset',
    'API',
    'Tutorial',
    'Deployment',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setError('Title and URL are required');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post(`/projects/${projectId}/links`, {
        title,
        url,
        description,
        category,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add External Reference Link"
      subtitle="Save useful documentation, API keys, GitHub repos, or research links"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Link Title *"
          placeholder="e.g. Gemini 1.5 Pro API Reference"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Input
          label="URL *"
          placeholder="https://ai.google.dev/docs"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={<LinkIcon className="w-4 h-4" />}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Description / Context
          </label>
          <textarea
            rows={2}
            placeholder="Notes regarding how this resource is used in our project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={Plus}>
            Add Link
          </Button>
        </div>
      </form>
    </Modal>
  );
};
