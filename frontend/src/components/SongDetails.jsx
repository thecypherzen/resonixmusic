import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import SongList from './SongList';
import { FaPlay, FaPause } from "react-icons/fa6";

const SongDetails = () => {
  const { currentTrack, isPlaying, togglePlay, queue } = usePlayer();
  const navigate = useNavigate();

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-[75vh] w-full">
        <div className="flex flex-col gap-2 ">
          <p className="text-neutral-400 m-auto font-extrabold text-2xl">No track selected</p>
          <button onClick={() => navigate(`/music`)} className='bg-transparent border border-neutral-700 py-2 px-8 text-sm rounded-full hover:bg-neutral-800 transition-all duration-200 w-[8rem] mx-auto'>Go home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex ml-auto h-[calc(100vh-13rem)]">
      {/* Left side - Song Details */}
      <div className="flex-grow px-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center max-w-2xl">
          <div className="relative group">
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className="w-[24rem] h-[24rem] rounded-lg shadow-xl object-cover"
            />
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-6xl">
                {isPlaying ? <FaPause className='bg-transparent' /> : <FaPlay className='bg-transparent' />}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Queue */}
      <div className="w-[30rem] ">
        <SongList />
      </div>
    </div>
  );
};

export default SongDetails;