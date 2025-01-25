import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit2, Mail, Calendar } from 'lucide-react';

const CURRENT_DATE = '2025-01-24 23:01:06';
const CURRENT_USER = 'gabrielisaacs';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile Header */}
      <div className="relative min-h-[20rem] flex items-end">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#212124]/80 to-[#121212]" />

        {/* Profile Content */}
        <div className="relative z-10 p-8 w-full">
          <div className="flex items-end gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-[12rem] h-[12rem] rounded-full bg-[#282828] flex items-center justify-center text-5xl font-bold shadow-2xl">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={24} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-400">Profile</span>
              <h1 className="text-6xl font-bold">{user?.username || 'User'}</h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Mail size={16} />
                  {user?.email || 'email@example.com'}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar size={16} />
                  Joined {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-[#282828]/50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="text-neutral-400 text-sm">
              No recent activity
            </div>
          </div>

          {/* Playlists */}
          <div className="bg-[#282828]/50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
            <div className="text-neutral-400 text-sm">
              No playlists created yet
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-[#282828]/50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors">
                Email Preferences
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors">
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-[#282828]/50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors flex items-center gap-3">
                <img src="/src/assets/svg/google.svg" alt="Google" className="w-4 h-4" />
                Connect Google Account
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors flex items-center gap-3">
                <img src="/src/assets/svg/facebook.svg" alt="Facebook" className="w-4 h-4" />
                Connect Facebook Account
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-[#212124] hover:bg-[#313134] rounded-lg transition-colors flex items-center gap-3">
                <img src="/src/assets/svg/apple.svg" alt="Apple" className="w-4 h-4" />
                Connect Apple Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;