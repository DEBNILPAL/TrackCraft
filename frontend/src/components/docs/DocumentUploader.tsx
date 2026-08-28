import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import api from '../../services/api';

interface DocumentUploaderProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  projectId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [isArchitectureDiagram, setIsArchitectureDiagram] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fileUrl) {
      setError('Document Name and File URL / Upload Path are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.post(`/projects/${projectId}/documents`, {
        name,
        description,
        fileUrl,
        fileType,
        isArchitectureDiagram,
      });

      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save document metadata');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Project Document"
      subtitle="Add manuals, PDFs, or system architecture diagrams"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <Input
          label="Document Name *"
          placeholder="e.g. System Architecture Flowchart v1.0"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief notes regarding document content..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <Input
          label="File URL / Cloud Link *"
          placeholder="https://..."
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          icon={<LinkIcon className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              File Format
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="pdf">PDF Document</option>
              <option value="png">PNG Image</option>
              <option value="jpg">JPG Image</option>
              <option value="svg">SVG Vector</option>
              <option value="doc">Word / Text Doc</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-400">
              <input
                type="checkbox"
                checked={isArchitectureDiagram}
                onChange={(e) => setIsArchitectureDiagram(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <ImageIcon className="w-4 h-4" /> Is Architecture Diagram
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="glow" size="md" type="submit" isLoading={isLoading} icon={Upload}>
            Save Metadata
          </Button>
        </div>
      </form>
    </Modal>
  );
};
