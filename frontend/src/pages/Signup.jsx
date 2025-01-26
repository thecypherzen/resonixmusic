import React, { useState } from 'react';
import { Mail, LockKeyhole, EyeOff, Eye, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CURRENT_DATE = '2025-01-25 00:24:15';
const CURRENT_USER = 'gabrielisaacs';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-6 fixed inset-0">
      {/* Animated gradient blur background */}
      <motion.div
        className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 mt-20 -ml-20 lg:mt-40 lg:-ml-40 opacity-80 fixed"
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

      {/* Main content container */}
      <div className="flex h-full">
        {/* Fixed left section with logo and image */}
        <div className="w-1/2 fixed left-0 top-0 h-full flex items-center mt-[4.75rem]">
          <div className="ml-32 mt-20">
            <img src="/logo-grad.png" alt="resonix logo" className="w-[8rem] lg:w-[10rem]" />
            <img src="/user-3d.png" className="w-[25rem]" />
          </div>
        </div>

        {/* Scrollable right section with form */}
        <div className="w-1/2 ml-auto h-full overflow-y-auto">
          <div className="min-h-full flex items-center justify-center pr-32">
            <form className="w-96 py-20" onSubmit={handleSubmit}>
              <p className="text-2xl">Sign up</p>
              <p className="text-sm mt-5">
                If you already have an account, <Link to="/login" className="text-sky-500">Login here!</Link>
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-8 text-sm">
                <label htmlFor="email" className="mb-2 text-xs block">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-grow bg-transparent border-b border-slate-50 focus:outline-none pb-1"
                    required
                  />
                </div>
              </div>

              <div className="mt-10 text-sm">
                <label htmlFor="username" className="mb-2 text-xs block">Username</label>
                <div className="flex items-center gap-2">
                  <UserRound className="w-4 text-xs" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className="flex-grow bg-transparent border-b border-slate-50 focus:outline-none pb-1"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 text-sm">
                <label htmlFor="password" className="mb-2 text-xs block">Password</label>
                <div className="flex items-center gap-2 relative">
                  <LockKeyhole className="w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="flex-grow bg-transparent border-b border-slate-50 focus:outline-none pb-1"
                    required
                  />
                  <span
                    className="ml-auto cursor-pointer absolute right-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="w-4" /> : <EyeOff className="w-4" />}
                  </span>
                </div>
              </div>

              <div className="mt-8 text-sm">
                <label htmlFor="confirmPassword" className="mb-2 text-xs block">Confirm Password</label>
                <div className="flex items-center gap-2 relative">
                  <LockKeyhole className="w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="flex-grow bg-transparent border-b border-slate-50 focus:outline-none pb-1"
                    required
                  />
                  <span
                    className="ml-auto cursor-pointer absolute right-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye className="w-4" /> : <EyeOff className="w-4" />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 rounded-full text-sm my-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  'Register'
                )}
              </button>

              <div className="text-center text-xs text-neutral-400">
                By signing up, you agree to our{' '}
                <a href="#" className="text-sky-500">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-sky-500">Privacy Policy</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Signup;