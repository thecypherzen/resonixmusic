import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('Invalid auth parameters');
        }

        // Exchange code for token through backend
        const response = await fetch(`${API_BASE_URL}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code, state })
        });

        const data = await response.json();

        if (data.headers.status === 'success' && data.results?.[0]) {
          await handleAuthCallback(data.results[0]);
          navigate('/profile');
        } else {
          throw new Error(data.headers.error_message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback failed:', error);
        navigate('/login');
      }
    };

    handleAuth();
  }, [searchParams, navigate, handleAuthCallback]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#121212]">
      <div className="text-center">
        <h2 className="text-xl mb-4 text-white">Completing authentication...</h2>
        <div className="animate-spin h-8 w-8 border-4 border-sky-500 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback;