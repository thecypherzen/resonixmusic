import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, House, Compass, ChartNoAxesCombined, ListMusic, Disc, Music, MicVocal, Plus, Trash2 } from 'lucide-react';

const SideBar = () => {
  const [playlists, setPlaylists] = useState([]);
  const userLogin = 'gabrielisaacs'; // Updated to current user's login
  const initials = userLogin.substring(0, 2).toUpperCase();
  const location = useLocation();

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
            <button className='ml-auto bg-transparent'>
              <Menu />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-6 mb-10 mt-2 ml-2">
          <Link
            to='/music'
            className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${location.pathname === '/music' ? 'text-[#08B2F0]' : ''
              }`}
          >
            <House />
            <p>Home</p>
          </Link>
          <Link
            to='/explore'
            className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${location.pathname === '/explore' ? 'text-[#08B2F0]' : ''
              }`}
            onClick={(e) => e.preventDefault()}
          >
            <Compass />
            <p>Explore</p>
          </Link>
          <Link
            to='/trending'
            className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${location.pathname === '/trending' ? 'text-[#08B2F0]' : ''
              }`}
            onClick={(e) => e.preventDefault()}
          >
            <ChartNoAxesCombined />
            <p>Trending</p>
          </Link>
        </div>

        {/* Collection Section */}
        <div className="flex flex-col gap-6 my-6 text-[0.875rem]">
          <p className="text-white opacity-40 text-xs font-400 -mb-2">MY COLLECTION</p>
          <div className="flex flex-col ml-2 space-y-6">
            <Link
              to="/playlists"
              className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <ListMusic />
              <p>Playlist</p>
            </Link>
            <Link
              to="/albums"
              className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <Disc />
              <p>Albums</p>
            </Link>
            <Link
              to="/artists"
              className="inline-flex gap-2 hover:text-[#08B2F0] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <MicVocal />
              <p>Artists</p>
            </Link>
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
                    <Link
                      to={`/playlist/${index}`}
                      className="flex-grow"
                      onClick={(e) => e.preventDefault()}
                    >
                      {playlist}
                    </Link>
                    <button
                      onClick={() => handleDeletePlaylist(index)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 bg-transparent"
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