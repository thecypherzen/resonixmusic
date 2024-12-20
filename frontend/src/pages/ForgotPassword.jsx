import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // form submission logic
    console.log('Email:', email);
  };

  return (
    <div className="flex flex-col mx-auto gap-6 relative w-screen h-screen overflow-hidden">
      {/* Animated gradient blur background */}
      <motion.div
        className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 absolute mt-20 -ml-20 lg:mt-40 lg:-ml-40 opacity-80"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        initial={{ x: -200, y: -200 }}
      >
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-2 items-center">
        <div className="grid w-92 mt-20 ml-28 overflow-hidden">
          <img src="/logo-grad.png" alt="resonix logo" className="w-[8rem] lg:w-[10rem]" />
          <img src="/user-3d.png" className="w-[25rem] -pb-96" />
        </div>

        {/* Forgot Password form */}
        <form className="grid w-96 h-auto -mt-32" onSubmit={handleSubmit}>
          <p className="text-2xl">Forgot Password</p>
          <p className="text-sm mt-5">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="mt-10 text-sm">
            <label htmlFor="email" className="mb-4 block">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="w-4" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-transparent border-b border-slate-50 focus:outline-none pb-1"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-sky-500 rounded-full text-sm my-8 py-2">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;