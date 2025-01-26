import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

const ComingSoon = () => {
  return (
    <div className="flex-1 overflow-hidden w-full relative">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute top-0 right-0 w-[30rem] h-[30rem] opacity-30 blur-[100px]"
        animate={{
          background: [
            'radial-gradient(circle, rgba(8,178,240,1) 0%, rgba(8,178,240,0) 70%)',
            'radial-gradient(circle, rgba(45,136,255,1) 0%, rgba(45,136,255,0) 70%)',
            'radial-gradient(circle, rgba(8,178,240,1) 0%, rgba(8,178,240,0) 70%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-[#fff7ae] from-20% via-[#ff34ee] to-sky-500 to-75% text-transparent bg-clip-text">
            Coming Soon
          </h1>
          <p className="text-xl text-neutral-400 mb-8">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex gap-4">
              <motion.div
                className="w-3 h-3 rounded-full bg-[#08B2F0]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0,
                }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-[#08B2F0]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.2,
                }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-[#08B2F0]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.4,
                }}
              />
            </div>
            <a
              href="https://github.com/gabrielisaacs/resonix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-transparent border border-neutral-600 rounded-full hover:bg-neutral-800 transition-all"
            >
              <FaGithub size={20} />
              <span>Follow the progress on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;