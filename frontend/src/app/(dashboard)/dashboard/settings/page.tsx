'use client';

import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useAuth } from '@/stores/auth';
import { 
  User, 
  Key, 
  Bell, 
  Database,
  Save,
  Loader2,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const { user, checkSession } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    institution: '',
    role: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await account.updateName(profile.name);
      await checkSession(); // Refresh user data
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      await account.updatePassword(passwords.new, passwords.current);
      setPasswords({ current: '', new: '', confirm: '' });
      setMessage('Password updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Storage', icon: Database },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={profile.institution}
                    onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                    placeholder="University or Company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="">Select role</option>
                    <option value="phd">PhD Student</option>
                    <option value="postdoc">Postdoc</option>
                    <option value="professor">Professor</option>
                    <option value="researcher">Researcher</option>
                    <option value="technician">Lab Technician</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Security Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button className="px-4 py-2 rounded-lg synapse-gradient text-white font-medium hover:opacity-90">
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              
              <div className="space-y-3">
                {[
                  { label: 'Analysis complete', desc: 'When an analysis finishes running' },
                  { label: 'Collaboration', desc: 'When someone shares an experiment with you' },
                  { label: 'Weekly summary', desc: 'Weekly digest of your research activity' },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg cursor-pointer">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-primary focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Data & Storage</h2>
              
              <div className="p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-300">Storage Used</p>
                  <p className="text-white font-medium">0 MB / 5 GB</p>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-0" />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-600 rounded-lg text-white hover:bg-slate-700">
                  Export All Data
                </button>
                <button className="px-4 py-2 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/10">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
