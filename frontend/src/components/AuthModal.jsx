import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-start z-[100] ml-[14rem] mt-[7rem]">
      <div className="bg-[#121212] w-[25rem] p-6 shadow-2xl border rounded-xl border-neutral-700/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Playlist</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors bg-transparent"
          >
            <X size={20} />
          </button>
        </div>
        <div className="py-4">
          <p className="text-neutral-400 text-md mb-6">
            Login to create and manage playlists
          </p>
          <div className="flex space-x-4 justify-end">
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="px-8 py-2 bg-[#08B2F0] text-black rounded-full hover:bg-opacity-80 transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/signup');
              }}
              className="bg-transparent px-8 py-2 border border-neutral-600 rounded-full hover:bg-neutral-800 transition-colors duration-200"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;