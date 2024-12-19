import React from 'react'
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col mx-auto gap-6 relative w-screen h-screen">

      {/* gradient blur background */}
      <motion.div className='w-[600px] h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[200px] rounded-full -z-20 absolute -mt-40 -ml-40 opacity-80' animate={{
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
      <div className='flex flex-col items-center gap-8 my-auto'>
        <p className='text-center text-2xl'>
          welcome to
        </p>
        <img src="/logo-grad.png" alt="resonix logo" className="w-100 mx-auto" />

        {/* next arrow */}
        <button className='mx-auto bg-[#212121] rounded-full p-2 h-14 w-14 border-neutral-800 border'>
          <ChevronRight className='mx-auto h-8 w-8' />
        </button>

        <p className='text-center italic'>
          ...let the beat resonates in your soul!
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen;