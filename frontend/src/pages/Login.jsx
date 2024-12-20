import React from 'react'
import { Mail, LockKeyhole, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  return (
    <div className="flex flex-col mx-auto gap-6 relative w-screen h-screen overflow-hidden">

      {/* animated gradient blur background */}
      <motion.div className='w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 absolute mt-20 -ml-20 lg:mt-40 lg:-ml-40 opacity-80' animate={{
        x: [0, 100, -100, 0],
        y: [0, -100, 100, 0],
      }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        initial={{ x: -200, y: -200 }}>
      </motion.div>

      {/* main content */}
      <div className='grid grid-cols-2 items-center'>
        <div className="grid w-92 mt-20 ml-28 overflow-hidden">
          <img src="/logo-grad.png" alt="resonix logo" className="w-[8rem] lg:w-[10rem]" />

          <img src="/user-3d.png" className='w-[25rem] -pb-96' />
        </div>


        {/* login details */}
        <div className="grid w-96 h-auto -mt-32">
          <p className="text-2xl">
            Sign in
          </p>
          <p className="text-sm mt-5">
            If you don't have an account, <span className='text-sky-500'>Register here!</span>
          </p>
          <div className="mt-10 text-sm">
            <p className="mb-4">
              Email
            </p>
            <div className="inline-flex items-center gap-2">
              <Mail className='w-4' />
              <p>Enter your email address</p>
            </div>
            <div className="w-full border-b bg-slate-50 "></div>
          </div>

          <div className="mt-10 text-sm">
            <p className="mb-4">
              Password
            </p>
            <div className="inline-flex items-center gap-2 relative">
              <LockKeyhole className='w-4' />
              <p>Enter your password</p>
              <EyeOff className='w-4 ml-auto -right-56 absolute' />
            </div>
            <div className="w-full border-b bg-slate-50 "></div>
          </div>
          <div className="inline-flex items-center gap-2 text-xs mt-2">
            <input type="checkbox" className='bg-slate-50 w-4 pointer'></input>
            <p className=''>Remember me</p>
            <p className='text-right ml-[10.5rem]'>Forgot Password?</p>
          </div>
          <button type="submit" className='w-full bg-sky-500 rounded-full text-sm my-8'>Login</button>

          <p className='text-center text-xs mb-6'>or continue with</p>
          <din className="grid">
            <div className="inline-flex gap-4 mx-auto ">
              <img src="/src/assets/svg/facebook.svg" className='w-6' />
              <img src="/src/assets/svg/apple.svg" className='w-8' />
              <img src="/src/assets/svg/google.svg" className='w-6' />
            </div>
          </din>
        </div>

      </div>

    </div>
  )
}

export default Login;