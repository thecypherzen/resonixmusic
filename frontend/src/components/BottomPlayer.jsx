import React from 'react';
import { FaShuffle, FaRepeat, FaVolumeLow, FaVolumeHigh, FaVolumeOff, FaForwardStep, FaBackwardStep, FaPlay, FaPause } from 'react-icons/fa6';
import { usePlayer } from '../context/PlayerContext';

const BottomPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seekTo
  } = usePlayer();

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    seekTo(value);
  };

  const handleVolumeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setVolume(value);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeOff className='w-[1rem] h-[1rem]' />;
    if (volume <= 60) return <FaVolumeLow className='w-[1rem] h-[1rem]' />;
    return <FaVolumeHigh className='w-[1rem] h-[1rem]' />;
  };

  if (!currentTrack) return null;

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <div className='h-[7rem] fixed bottom-0 left-0 z-50 w-full bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-30 items-center justify-center'>
      <div className="flex mx-2 gap-10">
        {/* Track info */}
        <div className="flex flex-row items-center m-4 w-[25rem] h-[4rem] gap-4">
          <img
            src={currentTrack.artwork || '/default-artwork.png'}
            alt='Thumbnail'
            className="w-[4rem] h-[4rem] rounded-xl object-cover"
          />
          <div className="flex flex-col text-[0.875rem] font-semibold w-full">
            <p className='text-lg'>{truncateTitle(currentTrack.title, 12)}</p>
            <p className='text-neutral-500'>{currentTrack.artist}</p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex flex-col w-full mx-auto gap-3 content-center my-auto pt-4">
          <div className="flex flex-row gap-6 items-center mx-auto">
            <button
              onClick={toggleShuffle}
              className={`bg-transparent hover:text-[#08B2F0] transition-colors ${shuffle ? 'text-[#08B2F0]' : ''}`}
            >
              <FaShuffle className='w-[0.875rem] h-[0.875rem]' />
            </button>
            <button
              onClick={playPrevious}
              className='bg-transparent hover:text-[#08B2F0] transition-colors'
            >
              <FaBackwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button
              onClick={togglePlay}
              className='bg-transparent transition-colors duration-200'
            >
              {isPlaying
                ? <FaPause className=' mx-auto my-auto text-white hover:text-[#08b2f0] w-[1.7rem] h-[1.7rem]' />
                : <FaPlay className=' mx-auto my-auto text-white hover:text-[#08b2f0] w-[1.7rem] h-[1.7rem]' />
              }
            </button>
            <button
              onClick={playNext}
              className='bg-transparent hover:text-[#08B2F0] transition-colors'
            >
              <FaForwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button
              onClick={toggleRepeat}
              className={`bg-transparent hover:text-[#08B2F0] transition-colors ${repeat !== 'none' ? 'text-[#08B2F0]' : ''}`}
            >
              <FaRepeat className='w-[0.875rem] h-[0.875rem]' />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex flex-row gap-2 items-center">
            <span className="text-neutral-400 text-xs min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={handleProgressChange}
              className="w-full h-1.5 rounded-full bg-neutral-600 cursor-pointer"
            />
            <span className="text-neutral-400 text-xs min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex flex-row gap-3 m-4 my-auto h-[2.5rem] w-[18rem] items-center pr-4">
          {getVolumeIcon()}
          <input
            type="range"
            value={volume}
            onChange={handleVolumeChange}
            className='w-full h-1.5 rounded-full bg-neutral-600 cursor-pointer'
            min="0"
            max="100"
            step="1"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;