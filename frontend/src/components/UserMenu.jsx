import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut } from 'lucide-react';

const CURRENT_DATE = '2025-01-24 22:37:57';
const CURRENT_USER = 'gabrielisaacs';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[2rem] h-[2rem] bg-[#212124] rounded-full border border-neutral-800 items-center justify-center hover:border-neutral-600 transition-colors duration-200"
      >
        <p className="text-white text-xs text-center shadow-lg">
          {initials}
        </p>
      </button>

      {isOpen && (
        <div className="absolute -right-10 mt-2 w-48 bg-[#282828] rounded-lg shadow-xl border border-neutral-700 py-1 z-[500]">
          <div className="px-4 py-3 border-b border-neutral-700">
            <p className="text-sm font-medium text-white">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {user?.email || 'email@example.com'}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="bg-transparent rounded-none w-full px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="bg-transparent rounded-none w-full px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Settings size={16} />
              Settings
            </button>
          </div>

          <div className="py-1 border-t border-neutral-700">
            <button
              onClick={handleLogout}
              className="bg-transparent rounded-none w-full px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading state component
const UserMenuSkeleton = () => {
  return (
    <div className="w-[2rem] h-[2rem] bg-neutral-800 rounded-full animate-pulse">
    </div>
  );
};

// Error state component
const UserMenuError = () => {
  return (
    <div className="w-[2rem] h-[2rem] bg-red-900/20 rounded-full flex items-center justify-center">
      <span className="text-red-500 text-xs">!</span>
    </div>
  );
};

export { UserMenu as default, UserMenuSkeleton, UserMenuError };