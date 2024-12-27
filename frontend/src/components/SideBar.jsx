import React from 'react';
import { Menu, Radio, ListMusic, Disc, Music, MicVocal } from 'lucide-react';

const SideBar = () => {
  return (
    <div className='flex flex-col min-h-screen min-w-[15rem] px-6 py-6 bg-[#212124] border-r border-neutral-800'>

      {/* Navbar */}
      <div className="flex flex-row gap-4 items-center mb-6">
        <a href="#">
          <div className="flex w-[1.45rem] h-[1.45rem] bg-[#63676F] rounded-full">
            <p className="text-white opacity-40 text-xs text-center m-auto ">Gi</p>
          </div>
        </a>
        <img src="/logo-grad.png" alt="resonix logo" className='w-[5.313rem] h-[0.875rem]' />
        <a href="#" className='ml-auto' >
          <Menu />
        </a>
      </div>

      {/* Home, Explore, Videos */}
      <div className="flex flex-col gap-6 my-6">
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">
          Home
        </a>
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">Explore</a>
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">Videos</a>
      </div>

      {/* My collection */}
      <div className="flex flex-col gap-6 my-6 text-[0.875rem]">
        <p className="text-white opacity-40 text-xs font-400 -mb-2">MY COLLECTION</p>
        <div className="flex flex-col ml-2">
          <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0]">
            <Radio />
            <p>Mixes and Radio</p>
          </a>
        </div>
        <div className="flex flex-col ml-2">
          <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0]">
            <ListMusic />
            <p>Playlist</p>
          </a>
        </div>
        <div className="flex flex-col ml-2">
          <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0]">
            <Disc />
            <p>Albums</p>
          </a>
        </div>
        <div className="flex flex-col ml-2">
          <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0]">
            <Music />
            <p>Tracks</p>
          </a>
        </div>
        <div className="flex flex-col ml-2">
          <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0]">
            <MicVocal />
            <p>Artists</p>
          </a>
        </div>

        {/* My playlist */}
        <div className="flex flex-col gap-4 my-6 text-[0.875rem]">
          <p className="text-white opacity-40 text-xs font-400">MY PLAYLISTS</p>
          <div className="flex flex-col ml-2 gap-6">
            <a href='#' className='hover:text-[#08B2F0]'>Mixes and Radio</a>
            <a href='#' className='hover:text-[#08B2F0]'>Christmas</a>
            <a href="#" className='hover:text-[#08B2F0]'>Chill 123</a>
            <a href="#" className='hover:text-[#08B2F0]'>Party mix</a>
            <a href="#" className='hover:text-[#08B2F0]'>Afrobeat Jams</a>
            <a href="#" className='hover:text-[#08B2F0]'>Amapiano</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar;