import React, { useState } from 'react';
import { MessageSquare, FolderGit2, ShieldAlert } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ChatRoom } from '../components/chat/ChatRoom';
import { EmptyState } from '../components/common/EmptyState';

export const GlobalChatPage: React.FC = () => {
  const { projects } = useProject();
  const joinedProjects = projects.filter((p) => p.isMember);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    joinedProjects[0]?.id || ''
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || joinedProjects[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Team Chat Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time project communication streams for verified teammates
          </p>
        </div>
      </div>

      {joinedProjects.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No joined projects for chat"
          description="Join a project using the project password from the dashboard to access project team chat."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Project Selector List */}
          <div className="lg:col-span-1 glass-card p-4 rounded-3xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
              Your Joined Projects
            </h4>
            {joinedProjects.map((proj) => {
              const isSelected = (selectedProject?.id || selectedProjectId) === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <FolderGit2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{proj.name}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <ChatRoom
                projectId={selectedProject.id}
                projectName={selectedProject.name}
                isMember={selectedProject.isMember}
              />
            ) : (
              <p className="text-xs text-slate-400 italic">Select a project to start chatting.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
