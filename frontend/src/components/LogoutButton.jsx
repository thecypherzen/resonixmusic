import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white hover:text-sky-500 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;