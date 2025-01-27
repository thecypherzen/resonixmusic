import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Create the context with a default value
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: () => { },
  logout: () => { },
  handleAuthCallback: () => Promise.resolve()
});

// Create a named function component for the provider
function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
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
      const userProfile = await authService.fetchUserProfile(userData.accessToken);

      userData.profile = userProfile;
      localStorage.setItem('auth_data', JSON.stringify(userData));

      setAuthState({
        isAuthenticated: true,
        user: userData,
        loading: false,
        error: null
      });

      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Authentication failed',
        loading: false
      }));
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      const authStatus = await authService.checkAuthStatus();
      setAuthState({
        isAuthenticated: authStatus.isAuthenticated,
        user: authStatus.user,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    authService.initiateLogin();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
      navigate('/login');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Logout failed. Please try again.'
      }));
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    handleAuthCallback
  };

  if (authState.loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook with a memorable name
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Export the provider component and hook separately
export { AuthProvider, useAuth };