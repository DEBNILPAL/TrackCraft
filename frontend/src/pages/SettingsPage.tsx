import React, { useState } from 'react';
import { User, KeyRound, Moon, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import api from '../services/api';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Profile Form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.put('/auth/profile', { fullName, phone, avatarUrl });
      if (res.data.success) {
        updateUser(res.data.data.user);
        setToastType('success');
        setToastMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setSecurityLoading(true);
    try {
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      if (res.data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setToastType('success');
        setToastMessage('Password changed successfully!');
      }
    } catch (err: any) {
      setToastType('error');
      setToastMessage(err.response?.data?.message || 'Password update failed');
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">Account & Application Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your developer profile and security credentials</p>
      </div>

      {/* Profile Settings */}
      <Card glass className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> Personal Profile
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email Address (Read-only)"
              value={user?.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Avatar Image URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="glow" size="md" type="submit" isLoading={profileLoading} icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>

      {/* Theme Status */}
      <Card glass className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
          <Moon className="w-4 h-4" /> Application Theme
        </h3>
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-glow">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">Dark Theme</p>
              <p className="text-xs text-slate-400">Glassmorphism dark theme enabled across all developer workspaces.</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Active
          </span>
        </div>
      </Card>

      {/* Security */}
      <Card glass className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4" /> Security & Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="danger" size="md" type="submit" isLoading={securityLoading} icon={Save}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};
