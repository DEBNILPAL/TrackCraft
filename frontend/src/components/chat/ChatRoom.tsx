import React, { useEffect, useState, useRef } from 'react';
import { Send, Lock, MessageSquare, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import api from '../../services/api';
import { MessageBubble } from './MessageBubble';
import { Button } from '../common/Button';

interface ChatRoomProps {
  projectId: string;
  projectName: string;
  isMember: boolean;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ projectId, projectName, isMember }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch Messages via REST API
  const fetchMessages = async () => {
    if (!isMember) return;
    try {
      const res = await api.get(`/projects/${projectId}/messages`);
      if (res.data.success) {
        setMessages(res.data.data);
        setError('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: You are not a member of this chat room.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isMember) {
      setIsLoading(false);
      return;
    }

    fetchMessages();

    // Socket.IO Integration
    const socket = getSocket();

    if (socket) {
      if (!socket.connected) {
        socket.connect();
      }

      // Join room
      socket.emit('join_project_room', { projectId });

      // Socket Listeners
      const handleNewMessage = (msg: ChatMessage) => {
        if (msg.projectId === projectId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      };

      const handleErrorMessage = (data: { message: string }) => {
        setError(data.message);
      };

      socket.on('new_chat_message', handleNewMessage);
      socket.on('error_message', handleErrorMessage);

      // Backup Polling every 5 seconds if socket drops
      const pollInterval = setInterval(() => {
        if (!socket.connected) {
          fetchMessages();
        }
      }, 5000);

      return () => {
        socket.emit('leave_project_room', { projectId });
        socket.off('new_chat_message', handleNewMessage);
        socket.off('error_message', handleErrorMessage);
        clearInterval(pollInterval);
      };
    }
  }, [projectId, isMember]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user || !isMember) return;

    const content = inputMessage.trim();
    setInputMessage('');

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('send_chat_message', { projectId, content });
    } else {
      // Fallback to REST API POST
      try {
        const res = await api.post(`/projects/${projectId}/messages`, { content });
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.data]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to send message');
      }
    }
  };

  if (!isMember) {
    return (
      <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800">
        <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-slate-100">Project Password Required</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Chat access is strictly restricted to verified project teammates. Please join this project using the project password.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Chat Room Header */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{projectName} Team Chat</h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Socket.IO Real-time Connected
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-950/60 space-y-1">
        {isLoading ? (
          <p className="text-xs text-slate-400 text-center py-8">Loading chat history...</p>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4" /> {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold">No messages yet</p>
            <p className="text-[11px] text-slate-500 mt-1">Start the conversation with your team!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isSelf={msg.userId === user?.id} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="Type a message to project teammates..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
        />
        <Button variant="glow" size="md" type="submit" icon={Send} disabled={!inputMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};
