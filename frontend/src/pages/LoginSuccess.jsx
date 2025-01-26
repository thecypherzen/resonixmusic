import { useEffect } from 'react';
import { motion } from 'framer-motion';

const LoginSuccess = () => {
  useEffect(() => {
    const sendAuthDataToParent = () => {
      try {
        // Get the auth data from the window object
        // This should be set by the backend in the HTML template
        const authData = window.__AUTH_DATA__;

        if (!authData) {
          throw new Error('No authentication data found');
        }

        // Send the auth data to the parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_SUCCESS',
              authData
            },
            window.location.origin
          );

          // Close the popup after a short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      } catch (error) {
        console.error('Error sending auth data:', error);
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'AUTH_ERROR',
              error: error.message
            },
            window.location.origin
          );
        }
      }
    };

    // Execute immediately when component mounts
    sendAuthDataToParent();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#121212]">
      <motion.div
        className="w-[300px] h-[300px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] rounded-full -z-20 fixed opacity-80"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/logo-grad.png"
            alt="Resonix Logo"
            className="w-32 mx-auto mb-8"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-4 text-white"
        >
          Login Successful!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-neutral-400">
            You've successfully connected with Jamendo
          </p>
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-500 text-sm">
            Redirecting back to Resonix...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginSuccess;