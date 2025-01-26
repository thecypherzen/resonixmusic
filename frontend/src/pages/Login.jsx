import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants/config';
import { ChevronLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleJamendoLogin = () => {
    // authService.initiateLogin();
    navigate('/coming-soon')
  };

  const handleJamendoSignup = () => {
    navigate('/coming-soon')
  };

  // const handleJamendoSignup = async () => {
  //   try {
  //     await authService.initiateSignup();
  //   } catch (error) {
  //     console.error('Signup failed:', error);
  //   }
  // };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#121212]">
      <motion.div
        className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 fixed mt-20 -ml-20 lg:mt-40 lg:-ml-40 opacity-80"
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        initial={{ x: 600, y: 800 }}
      />

      <div className="flex h-full px-20">
        <div className="w-1/2 h-full flex items-center">
          <div className="ml-[10rem] mt-[22rem] relative">
            <img src="/logo-grad.png" alt="resonix logo" className="w-[10rem] " />
            <img src="/user-3d.png" className="w-[30rem]" />

          </div>
        </div>

        <div className="w-1/2 ml-auto h-full flex items-center justify-center pr-32">
          <div className="w-96 text-center">
            <h1 className="text-4xl font-bold mb-8">Welcome to Resonix</h1>
            <p className="text-neutral-400 mb-8">
              Connect with your Jamendo account to access millions of tracks on Resonix
            </p>
            <p className="text-white text-sm mb-8">
              Resonix uses Jamendo to provide account features to its user. Sign in if you already have an account with Jamendo or Sign Up to be redirected to Jamendo to create an account.
            </p>
            <div className='flex flex-row gap-4'>
              <button
                onClick={handleJamendoLogin}
                className="w-full bg-sky-500 hover:bg-sky-600 text-black rounded-full py-3 px-6 transition-colors"
              >
                Login
              </button>
              <button
                onClick={handleJamendoSignup}
                className="w-full bg-transparent border border-neutral-600 hover:bg-neutral-800 text-white rounded-full py-3 px-6 transition-colors"
              >
                Sign Up
              </button>
            </div>

            <p className="mt-6 text-sm text-neutral-500">
              By continuing, you agree to Resonix's{' '}
              <Link to="/coming-soon" className="text-sky-500">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/coming-soon" className="text-sky-500">Privacy Policy</Link>
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex bg-transparent border border-neutral-600 hover:bg-neutral-800 text-white rounded-full p-3 transition-colors absolute right-24 top-[33rem] w-12 h-12 items-center justify-center"
          >
            <ChevronLeft />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;