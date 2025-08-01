import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col mx-auto gap-6 relative w-screen h-screen">
      {/* gradient blur background */}
      <motion.div
        className="w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-purple-500 from-10% via-blue-700 to-sky-500 blur-[100px] lg:blur-[200px] rounded-full -z-20 absolute -mt-20 -ml-20 lg:-mt-40 lg:-ml-40 opacity-80"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        initial={{ x: -200, y: -200 }}
      ></motion.div>

      {/* main content */}
      <div className="flex flex-col items-center my-auto">
        <p className="text-center text-xl lg:text-2xl ">welcome to</p>
        <img
          src="/logo-grad.png"
          alt="resonix logo"
          className="w-[24rem] lg:w-[34rem] mx-auto mb-6"
        />
        <p className="text-center italic mb-8">
          ...let the music resonate in your soul!
        </p>

        {/* next arrow */}
        <Link
          to="/login"
          className="flex mx-auto bg-[#212121] rounded-full h-10 w-10 lg:h-14 lg:w-14 border-neutral-800 border"
        >
          <ChevronRight className="m-auto h-6 w-6 lg:h-8 lg:w-8" />
        </Link>
      </div>
    </div>
  );
};

export default WelcomeScreen;
