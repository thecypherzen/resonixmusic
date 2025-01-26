import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../services/userService';
import { Edit2, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (user?.accessToken) {
          const userData = await fetchUserProfile(user.accessToken);
          setProfile(userData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user?.accessToken]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212]">
        <div className="animate-spin h-8 w-8 border-4 border-sky-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-red-500">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile Header */}
      <div className="relative min-h-[20rem] flex items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-[#212124]/80 to-[#121212]" />

        <div className="relative z-10 p-8 w-full">
          <div className="flex items-end gap-6">
            {/* Profile Picture */}
            <div className="relative group">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.dispname}
                  className="w-[12rem] h-[12rem] rounded-full object-cover shadow-2xl"
                />
              ) : (
                <div className="w-[12rem] h-[12rem] rounded-full bg-[#282828] flex items-center justify-center text-5xl font-bold shadow-2xl">
                  {profile?.dispname?.substring(0, 2).toUpperCase() || 'U'}
                </div>
              )}
              <button className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={24} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-400">Profile</span>
              <h1 className="text-6xl font-bold">{profile?.dispname || 'User'}</h1>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Mail size={16} />
                  {profile?.name || 'email@example.com'}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar size={16} />
                  Joined {profile?.creationdate?.split('-')[0] || new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-[#282828]/50 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-neutral-400">User ID</span>
                <span className="text-white">{profile?.id}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-neutral-400">Language</span>
                <span className="text-white">{profile?.lang?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;