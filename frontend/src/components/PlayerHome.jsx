import React, { useState } from 'react';
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PlayerHome = () => {
  const thumbnail = '../src/assets/png-jpg/thumbnail.png';
  const artistName = 'Artist Name';
  const albumTile = 'Album Title';
  const albumArtist = 'Artist';

  // keep track of the visible card indexes
  const [visibleArtists, setVisibleArtists] = useState(0);
  const [visibleAlbums, setVisibleAlbums] = useState(0);

  // Number of cards to show per set
  const cardsPerSet = 5;

  // Function to handle next set of cards
  const handleNext = (setVisible, visible, totalItems) => {
    if (visible + cardsPerSet < totalItems) {
      setVisible(visible + cardsPerSet);
    }
  };

  // Function to handle previous set of cards
  const handlePrevious = (setVisible, visible) => {
    if (visible - cardsPerSet >= 0) {
      setVisible(visible - cardsPerSet);
    }
  };

  // Example data for artists and albums
  const artists = new Array(10).fill({ name: artistName, thumbnail });
  const albums = new Array(10).fill({ title: 'Album Title', thumbnail });

  return (
    <div className='w-full min-h-screen flex flex-col mt-6 mx-16 gap-10'>

      {/* Popular Artists */}
      <div className="flex flex-col mb-10 w-full">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Popular Artists</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button
              onClick={() => handlePrevious(setVisibleArtists, visibleArtists)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleArtists, visibleArtists, artists.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronRight />
            </button>
            <button className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm">Show all</button>
          </div>
        </div>
        <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4">
          {artists.slice(visibleArtists, visibleArtists + cardsPerSet).map((artist, index) => (
            <a key={index} href='#' className='flex flex-col bg-transparent hover:bg-gradient-to-b from-transparent via-neutral-950 to-neutral-900 hover:bg-opacity-5 rounded-2xl w-[11.5rem] h-[15rem] px-4 py-2 gap-4 hover:border-none transition-all relative group mt-4'>
              <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7rem]">
                <FaPlay className='m-auto shadow-lg fill-black' />
              </div>
              <img src={artist.thumbnail} className="rounded-full h-[8.75rem] w-[8.75rem] border border-white border-opacity-5 shadow-md mx-auto" />
              <div className="flex flex-col text-left">
                <p className='font-bold text-lg'>{artist.name}</p>
                <p className='font-bold text-sm text-neutral-400'>Artist</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Albums for You */}
      <div className="flex flex-col mb-10">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Albums for you</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button
              onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleAlbums, visibleAlbums, albums.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronRight />
            </button>
            <button className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm">Show all</button>
          </div>
        </div>
        <div className="flex flex-row bg-transparent h-auto w-full gap-4 mt-4">
          {albums.slice(visibleAlbums, visibleAlbums + cardsPerSet).map((album, index) => (
            <a key={index} href='#' className='flex flex-col bg-neutral-900 rounded-xl w-[11.45rem] h-full p-3 gap-4 hover:border-none transition-all relative group'>
              <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7.8rem]">
                <FaPlay className='m-auto shadow-lg fill-black' />
              </div>
              <img src={album.thumbnail} className="rounded-xl h-auto w-full shadow-md" />
            </a>
          ))}
        </div>
      </div>

      {/* Trending Songs */}
      <div className="flex flex-col mb-10">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Trending</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button
              onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleAlbums, visibleAlbums, albums.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronRight />
            </button>
            <button className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm">Show all</button>
          </div>
        </div>
        <div className="flex flex-row bg-transparent h-[16rem] w-full"></div>
      </div>
    </div>
  )
}

export default PlayerHome;