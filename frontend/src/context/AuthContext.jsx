import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  const handleAuthCallback = async (authData) => {
    try {
      const userData = {
        accessToken: authData.access_token,
        tokenType: authData.token_type,
        scope: authData.scope,
        expiresAt: Date.now() + (authData.expires_in * 1000)
      };

      // Fetch user profile after successful auth
      const userProfile = await fetchUserProfile(userData.accessToken);

      userData.profile = userProfile;
      localStorage.setItem('auth_data', JSON.stringify(userData));

      setAuth(prev => ({
        ...prev,
        isAuthenticated: true,
        user: userData,
        loading: false
      }));

      return true;
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        error: 'Authentication failed',
        loading: false
      }));
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authStatus = await authService.checkAuthStatus();
      setAuth(prev => ({
        ...prev,
        isAuthenticated: authStatus.isAuthenticated,
        user: authStatus.user,
        loading: false
      }));
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  const login = () => {
    authService.initiateLogin();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuth(prev => ({
        ...prev,
        isAuthenticated: false,
        user: null
      }));
      navigate('/login');
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        error: 'Logout failed. Please try again.'
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout
      }}
    >
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};