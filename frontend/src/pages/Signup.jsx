import React, { useState } from 'react';
import { Mail, LockKeyhole, EyeOff, Eye, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Signup = () => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form Data:', formData);
  };

  return (
    <div className="flex flex-col mx-auto gap-6 relative w-screen h-screen overflow-hidden">
      {/* Animated gradient blur background */}
      <motion.div
        className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 absolute mt-20 -ml-20 lg:mt-40 lg:-ml-40 opacity-80"
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
      >
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-2 items-center">
        <div className="grid w-92 mt-20 ml-32 overflow-hidden">
          <img src="/logo-grad.png" alt="resonix logo" className="w-[8rem] lg:w-[10rem]" />
          <img src="/user-3d.png" className="w-[25rem] -pb-96" />
        </div>

        {/* Signup form */}
        <form className="grid w-96 h-auto -mt-20" onSubmit={handleSubmit}>
          <p className="text-2xl">Sign up</p>
          <p className="text-sm mt-5">
            If you already have an account, <Link to="/login" className="text-sky-500">Login here!</Link>
          </p>

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

          <button type="submit" className="w-full bg-sky-500 rounded-full text-sm my-8 py-2">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;