import React, { useState } from 'react';
import { Menu, Radio, ListMusic, Disc, Music, MicVocal, Plus, Trash2 } from 'lucide-react';

const SideBar = () => {
  // State to manage playlists
  const [playlists, setPlaylists] = useState([]);

  // Function to handle creating a new playlist
  const handleCreatePlaylist = () => {
    const newPlaylistName = `New Playlist ${playlists.length + 1}`;
    setPlaylists([...playlists, newPlaylistName]);
  };

  // Function to handle deleting a playlist
  const handleDeletePlaylist = (indexToDelete) => {
    setPlaylists(playlists.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className='flex flex-col min-h-screen min-w-[15rem] px-6 py-6 bg-[#212124] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30'>
      {/* Navbar */}
      <div className="flex flex-row gap-4 items-center mb-6">
        <img src="/logo-grad.png" alt="resonix logo" className='w-[5.313rem] h-[0.875rem]' />
        <a href="#" className='ml-auto'>
          <Menu />
        </a>
      </div>

      {/* Home, Explore, Videos */}
      <div className="flex flex-col gap-6 my-8">
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">
          Home
        </a>
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">Explore</a>
        <a href='#' className="text-white hover:text-[#08B2F0] text-base">Trending</a>
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
        <div className="flex flex-col gap-4 my-6 text-[0.875rem] pb-[5rem]">
          <p className="text-white opacity-40 text-xs font-400">MY PLAYLISTS</p>
          <div className="flex flex-col gap-6">
            {playlists.length === 0 ? (
              <button
                onClick={handleCreatePlaylist}
                className="inline-flex items-center justify-center py-2 px-4 bg-transparent gap-1 hover:bg-[#212121] transition-colors rounded-full border border-neutral-700 w-full"
              >
                <Plus size={16} />
                <span className="text-xs">Create Playlist</span>
              </button>
            ) : (
              <div className="flex flex-col gap-6 bg-transparent hover:bg-white hover:bg-opacity-5 py-2 px-4 rounded-md">
                {playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between transition-colors"
                  >
                    <a href='#' className="flex-grow">
                      {playlist}
                    </a>
                    <button
                      onClick={() => handleDeletePlaylist(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ml-2 bg-transparent"
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