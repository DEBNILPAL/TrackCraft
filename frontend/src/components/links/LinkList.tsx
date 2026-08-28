import React from 'react';
import { ExternalLink, Trash2, Globe, User } from 'lucide-react';
import { ReferenceLink } from '../../types';
import { Card } from '../common/Card';
import api from '../../services/api';

interface LinkListProps {
  links: ReferenceLink[];
  projectId: string;
  onRefresh: () => void;
}

export const LinkList: React.FC<LinkListProps> = ({ links, projectId, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reference link?')) return;
    try {
      await api.delete(`/projects/${projectId}/links/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (links.length === 0) {
    return <p className="text-xs text-slate-400 italic">No external reference links added yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link) => (
        <Card key={link.id} glass className="p-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {link.category}
              </span>
              <button
                onClick={() => handleDelete(link.id)}
                className="text-slate-400 hover:text-rose-400 transition-colors"
                title="Delete Link"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{link.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {link.description || 'No notes provided.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-4 text-xs">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-400" /> Added by {link.addedByName}
            </span>
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold transition-all text-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Open Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
};
