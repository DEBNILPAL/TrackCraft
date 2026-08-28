import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock, ShieldAlert, Check } from 'lucide-react';
import { NotificationItem } from '../../types';
import api from '../../services/api';

interface NotificationDropdownProps {
  onClose: () => void;
  onRefreshUnread: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose, onRefreshUnread }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.notifications);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      onRefreshUnread();
    } catch (err) {
      console.error(err);
    }
  };

  const markSingleRead = async (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      onRefreshUnread();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 z-50 glass-panel animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-bold text-slate-100">Activity Notifications</h4>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-4">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">No activity notifications</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markSingleRead(item.id, item.read)}
              className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                item.read
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  {!item.read && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
