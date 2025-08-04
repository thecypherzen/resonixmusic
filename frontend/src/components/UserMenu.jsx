import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Settings, LogOut } from "lucide-react";

const UserMenu = ({ className }) => {
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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const initials = user?.username?.substring(0, 2).toUpperCase() || "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 bg-[#212124] rounded-full border-1 border-neutral-800 dark:border-neutral-500 items-center justify-center hover:border-neutral-700 hover:bg-neutral-900 transition-colors duration-200"
      >
        <p className="text-white text-xs text-center shadow-lg">{initials}</p>
      </button>

      {isOpen && (
        <div className="absolute -right-10 mt-2 w-48 bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 py-1 z-[500]">
          <div className="px-4 py-3 border-b border-neutral-700">
            <p className="text-sm font-medium text-white">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-neutral-400 truncate">
              {user?.email || "email@example.com"}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/profile");
              }}
              className="bg-transparent rounded-none w-full px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <User size={16} />
              Profile
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
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
    <div className="w-[2rem] h-[2rem] bg-neutral-800 rounded-full animate-pulse"></div>
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
