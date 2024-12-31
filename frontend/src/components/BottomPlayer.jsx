import React, { useEffect, useState } from 'react';
import { FaShuffle, FaRepeat, FaVolumeLow, FaVolumeHigh, FaVolumeOff, FaForwardStep, FaBackwardStep, FaPlay } from 'react-icons/fa6';

const BottomPlayer = () => {
  const thumbnail = '../src/assets/png-jpg/thumbnail.png';
  const artist = 'The XX';
  const title = 'Angels';
  const duration = '3:10';
  const timeRem = '1:30';

  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const getVolumeIcon = () => {
    if (volume == 0) {
      return <FaVolumeOff className='w-[1rem] h-[1rem]' />;
    } else if (volume <= 60) {
      return <FaVolumeLow className='w-[1rem] h-[1rem]' />;
    } else {
      return <FaVolumeHigh className='w-[1rem] h-[1rem]' />;
    }
  };

  useEffect(() => {
    const rangeInput = document.getElementById('playProgress');
    const updateRangeValue = () => {
      const value = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
      rangeInput.style.setProperty('--value', `${value}%`);
    };

    rangeInput.addEventListener('input', updateRangeValue);
    updateRangeValue(); // Initial update

    return () => {
      rangeInput.removeEventListener('input', updateRangeValue);
    };
  }, []);

  return (
    <div className='h-[7rem] fixed bottom-0 left-0 z-50 w-full bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-30 items-center'>
      <div className="flex mx-2 gap-10">

        {/* Track Thumbnail, Title, Artist */}
        <div className="flex flex-row items-center m-4 w-[20rem] gap-4">
          <img src={thumbnail} alt='Thumbnail' className=" w-[4rem] h-[4rem] rounded-full " />
          <div className="flex flex-col text-[0.875rem] font-semibold">
            <p className='text-lg'>{title}</p>
            <p className='text-neutral-500'>{artist}</p>
          </div>
        </div>

        {/* Playback */}
        <div className="flex flex-col w-full mx-auto gap-3 content-center my-auto pt-4">

          {/* Play, shuffle next, repeat... */}
          <div className="flex flex-row gap-6 items-center mx-auto">
            <button className='bg-transparent'>
              <FaShuffle className='w-[0.875rem] h-[0.875rem]' />
            </button>
            <button className='bg-transparent'>
              <FaBackwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button className='p-1 rounded-full w-[2.7rem] h-[2.7rem] bg-transparent transition-colors 0.25s'>
              <FaPlay className='w-[1.25rem] h-[1.425rem] mx-auto my-auto ' />
            </button>
            <button className='bg-transparent'>
              <FaForwardStep className='w-[1.3rem] h-[1.3rem]' />
            </button>
            <button className='bg-transparent'>
              <FaRepeat className='w-[0.875rem] h-[0.875rem]' />
            </button>
          </div>

          {/* Duration container */}
          <div className="flex flex-row gap-2 items-center">
            <p className="text-neutral-400 text-xs">
              {duration}
            </p>
            <input
              type="range"
              name="playProgress"
              id="playProgress"
              className="w-full h-1.5 rounded-full bg-white cursor-pointer"
            />
            <p className="text-neutral-400 text-xs">
              {timeRem}
            </p>
          </div>
        </div>

        {/* Volume slider */}
        <div className="flex flex-row gap-2 m-4 my-auto h-[2.5rem] w-[18rem] items-center pr-4">
          {getVolumeIcon()}
          <input
            type="range"
            name="volumeBar"
            id="volumeBar"
            className='w-full h-1.5 rounded-full bg-white cursor-pointer'
            value={volume}
            onChange={handleVolumeChange}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div >
  )
}

export default BottomPlayer;