import React from 'react';
import { Heart, Ellipsis, Shuffle, Play, SkipForward, SkipBack, Repeat, Volume2, Cast, Menu, ChevronUp } from 'lucide-react';

const BottomPlayer = () => {
  const thumbnail = '../src/assets/png-jpg/thumbnail.png';
  const artist = 'The XX';
  const title = 'Angels';
  const albumTitle = 'Coexist'.toUpperCase();
  const duration = '3:10';
  const timeRem = '1:30';

  return (
    <div className='bg-[#1F1F22] h-[5.875rem] border-t border-neutral-800 w-full fixed bottom-0 left-0 z-50'>
      <div className="flex">

        {/* Track Thumbnail, Title, Artist */}
        <div className="flex flex-row items-center m-4 w-[16rem] gap-4">
          <img src={thumbnail} alt='Thumbnail' className=" w-[4rem] h-[4rem] rounded-sm " />
          <div className="flex flex-col text-[0.875rem] gap-[0.15rem] font-semibold">
            <div className="inline-flex gap-2">
              <p>{title}</p>
              <a href="#" className='ml-auto'>
                <Heart />
              </a>
              <a href="#">
                <Ellipsis className='' />
              </a>
            </div>
            <p className='text-neutral-400'>{artist}</p>
            <p className='text-[0.625rem] text-neutral-400 '>PLAYING FROM: {albumTitle}</p>
          </div>
        </div>

        {/* Playback */}
        <div className="flex flex-col w-[43.125rem] mx-auto gap-4 content-center my-auto">
          {/* Play, shuffle next, repeat... */}
          <div className="flex flex-row gap-4 items-center mx-auto">
            <button className='bg-transparent'>
              <Shuffle className='w-[0.875rem] h-[0.875rem]' />
            </button>
            <button className='bg-transparent'>
              <SkipBack className='w-[1rem] h-[1rem]' />
            </button>
            <button className='bg-transparent'>
              <Play className='w-[1.25rem] h-[1.25rem]' />
            </button>
            <button className='bg-transparent'>
              <SkipForward className='w-[1rem] h-[1rem]' />
            </button>
            <button className='bg-transparent'>
              <Repeat className='w-[0.875rem] h-[0.875rem]' />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex flex-row gap-4 items-center">
            <p className="text-neutral-500 text-sm">
              {duration}
            </p>
            <div className="w-full bg-neutral-600 rounded-full h-1.5">
              <div className="bg-white h-1.5 rounded-full"></div>
            </div>
            <p className="text-neutral-500 text-sm">
              {timeRem}
            </p>
          </div>
        </div>

        {/* Right container */}
        <div className="flex flex-row gap-4 m-4 my-auto h-[2.5rem] ">
          <button className='bg-transparent p-1.5 hover:border-neutral-700'>
            <Volume2 className='w-[1.5rem] h-[1.5rem]' />
          </button>
          <button className='bg-transparent p-1.5 hover:border-neutral-700'>
            <Cast className='w-[1.5rem] h-[1.5rem]' />
          </button>
          <button className='bg-transparent p-1.5 hover:border-neutral-700'>
            <Menu className='w-[1.5rem] h-[1.5rem]' />
          </button>
          <button className='bg-transparent p-1.5 hover:border-neutral-700'>
            <ChevronUp className='w-[1.5rem] h-[1.5rem]' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BottomPlayer;