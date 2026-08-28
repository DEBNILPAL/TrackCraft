import React, { useState } from 'react';
import { Image as ImageIcon, ExternalLink, Maximize2, Trash2 } from 'lucide-react';
import { DocumentItem } from '../../types';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import api from '../../services/api';

interface ArchitectureGalleryProps {
  diagrams: DocumentItem[];
  projectId: string;
  onRefresh: () => void;
}

export const ArchitectureGallery: React.FC<ArchitectureGalleryProps> = ({ diagrams, projectId, onRefresh }) => {
  const [selectedDiagram, setSelectedDiagram] = useState<DocumentItem | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete architecture diagram?')) return;
    try {
      await api.delete(`/projects/${projectId}/documents/${id}`);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (diagrams.length === 0) {
    return <p className="text-xs text-slate-400 italic">No architecture diagrams uploaded yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {diagrams.map((d) => (
          <Card key={d.id} glass className="p-4 flex flex-col justify-between group">
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3 flex items-center justify-center">
                <img
                  src={d.fileUrl}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <button
                  onClick={() => setSelectedDiagram(d)}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1"
                >
                  <Maximize2 className="w-4 h-4" /> Expand Preview
                </button>
              </div>
              <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{d.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{d.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-3 text-xs">
              <span className="text-[10px] text-slate-400">By {d.uploadedByName}</span>
              <div className="flex items-center gap-2">
                <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => handleDelete(d.id)} className="text-slate-400 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedDiagram && (
        <Modal
          isOpen={!!selectedDiagram}
          onClose={() => setSelectedDiagram(null)}
          title={selectedDiagram.name}
          subtitle={selectedDiagram.description}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <img src={selectedDiagram.fileUrl} alt={selectedDiagram.name} className="w-full h-auto max-h-[60vh] object-contain mx-auto" />
            </div>
            <div className="flex justify-end">
              <a href={selectedDiagram.fileUrl} target="_blank" rel="noreferrer">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Open Full Resolution
                </button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
