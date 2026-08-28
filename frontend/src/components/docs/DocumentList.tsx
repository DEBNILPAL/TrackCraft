import React from 'react';
import { FileText, ExternalLink, Trash2, User, Calendar } from 'lucide-react';
import { DocumentItem } from '../../types';
import { Card } from '../common/Card';
import api from '../../services/api';

interface DocumentListProps {
  documents: DocumentItem[];
  projectId: string;
  onRefresh: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, projectId, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document record?')) return;
    try {
      await api.delete(`/projects/${projectId}/documents/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (documents.length === 0) {
    return <p className="text-xs text-slate-400 italic">No standard project manuals uploaded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc.id} glass className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-100 truncate">{doc.name}</h4>
              <p className="text-xs text-slate-400 truncate">{doc.description || 'No description provided.'}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                <span className="flex items-center gap-1"><User className="w-3 h-3 text-indigo-400" /> {doc.uploadedByName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(doc.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-indigo-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-indigo-600 transition-colors"
              title="Open Document"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => handleDelete(doc.id)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};
