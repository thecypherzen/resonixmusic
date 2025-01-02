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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <FaVolumeOff className='w-[1rem] h-[1rem]' />;
    if (volume <= 60) return <FaVolumeLow className='w-[1rem] h-[1rem]' />;
    return <FaVolumeHigh className='w-[1rem] h-[1rem]' />;
  };

  if (!currentTrack) return null;

  return (
    <div className='h-[7rem] fixed bottom-0 left-0 z-50 w-full bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-30 items-center'>
      <div className="flex mx-2 gap-10">
        {/* Track info */}
        <div className="flex flex-row items-center m-4 w-[20rem] gap-4">
          <img src={currentTrack.artwork} alt='Thumbnail' className="w-[4rem] h-[4rem] rounded-full" />
          <div className="flex flex-col text-[0.875rem] font-semibold">
            <p className='text-lg'>{currentTrack.title}</p>
            <p className='text-neutral-500'>{currentTrack.artist}</p>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex flex-col w-full mx-auto gap-3 content-center my-auto pt-4">
          <div className="flex flex-row gap-6 items-center mx-auto">
            <button onClick={toggleShuffle} className={`bg-transparent ${shuffle ? 'text-[#08B2F0]' : ''}`}>
              <FaShuffle className='w-[0.875rem] h-[0.875rem]' />
            </button>
            <button onClick={playPrevious} className='bg-transparent'>
              <FaBackwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button onClick={togglePlay} className='p-1 rounded-full w-[2.7rem] h-[2.7rem] bg-transparent transition-colors 0.25s'>
              {isPlaying ?
                <FaPause className='w-[1.25rem] h-[1.425rem] mx-auto my-auto' /> :
                <FaPlay className='w-[1.25rem] h-[1.425rem] mx-auto my-auto' />
              }
            </button>
            <button onClick={playNext} className='bg-transparent'>
              <FaForwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button onClick={toggleRepeat} className={`bg-transparent ${repeat !== 'none' ? 'text-[#08B2F0]' : ''}`}>
              <FaRepeat className='w-[0.875rem] h-[0.875rem]' />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex flex-row gap-2 items-center">
            <p className="text-neutral-400 text-xs">{formatTime(currentTime)}</p>
            <input
              type="range"
              value={currentTime}
              max={duration}
              onChange={handleProgressChange}
              className="w-full h-1.5 rounded-full bg-white cursor-pointer"
            />
            <p className="text-neutral-400 text-xs">{formatTime(duration)}</p>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex flex-row gap-2 m-4 my-auto h-[2.5rem] w-[18rem] items-center pr-4">
          {getVolumeIcon()}
          <input
            type="range"
            value={volume}
            onChange={handleVolumeChange}
            className='w-full h-1.5 rounded-full bg-white cursor-pointer'
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomPlayer;