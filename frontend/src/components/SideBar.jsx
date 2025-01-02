import React, { useState } from 'react';
import { Menu, Radio, ListMusic, Disc, Music, MicVocal, Plus, Trash2 } from 'lucide-react';

const SideBar = () => {
  const [playlists, setPlaylists] = useState([]);
  const userLogin = 'janetjohn';
  const initials = userLogin.substring(0, 2).toUpperCase();

  const handleCreatePlaylist = () => {
    const newPlaylistName = `New Playlist ${playlists.length + 1}`;
    setPlaylists([...playlists, newPlaylistName]);
  };

  const handleDeletePlaylist = (indexToDelete) => {
    setPlaylists(playlists.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className='fixed left-0 top-0 bottom-0 w-[15rem] flex flex-col h-screen overflow-hidden bg-[#212124] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 z-40'>
      <div className='px-6 py-6'>
        {/* Navbar */}
        <div className="w-full h-[4.375rem]">
          <div className="flex flex-row gap-4 items-center">
            {/* Profile */}
            <button className="flex w-[2rem] h-[2rem] bg-[#212124] rounded-full border border-neutral-800 items-start">
              <p className="text-white text-xs text-center justify-center m-auto shadow-lg hover:opacity-60 transition-opacity duration-200">{initials}</p>
            </button>

            <img src="/logo-grad.png" alt="resonix logo" className='w-[5.313rem] h-[0.875rem]' />
            <a href="#" className='ml-auto'>
              <Menu />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-6 mb-8">
          <a href='#' className="text-white hover:text-[#08B2F0] text-base transition-colors duration-200">
            Home
          </a>
          <a href='#' className="text-white hover:text-[#08B2F0] text-base transition-colors duration-200">Explore</a>
          <a href='#' className="text-white hover:text-[#08B2F0] text-base transition-colors duration-200">Trending</a>
        </div>

        {/* Collection Section */}
        <div className="flex flex-col gap-6 my-6 text-[0.875rem]">
          <p className="text-white opacity-40 text-xs font-400 -mb-2">MY COLLECTION</p>
          <div className="flex flex-col ml-2 space-y-6">
            <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200">
              <ListMusic />
              <p>Playlist</p>
            </a>
            <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200">
              <Disc />
              <p>Albums</p>
            </a>
            {/* <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200">
              <Music />
              <p>Tracks</p>
            </a> */}
            <a href='#' className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200">
              <MicVocal />
              <p>Artists</p>
            </a>
          </div>
        </div>

        {/* Playlists Section */}
        <div className="flex flex-col gap-4 my-6 text-[0.875rem] pb-[7rem] overflow-y-auto">
          <p className="text-white opacity-40 text-xs font-400">MY PLAYLISTS</p>
          <div className="flex flex-col gap- group">
            {playlists.length === 0 ? (
              <button
                onClick={handleCreatePlaylist}
                className="inline-flex items-center justify-center py-2 px-4 bg-transparent gap-1 group-hover:bg-[#212121] transition-all duration-200 rounded-full border border-neutral-700 w-full"
              >
                <Plus size={16} />
                <span className="text-xs">Create Playlist</span>
              </button>
            ) : (
              <div className="flex flex-col gap-6 bg-transparent hover:bg-white hover:bg-opacity-5 py-2 px-4 rounded-md">
                {playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between transition-colors group"
                  >
                    <a href='#' className="flex-grow">
                      {playlist}
                    </a>
                    <button
                      onClick={() => handleDeletePlaylist(index)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 bg-transparent "
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;