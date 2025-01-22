import React from 'react';
import { FaPlay } from "react-icons/fa";

const ArtistCard = ({ artist, onClick, truncateTitle }) => {
  return (
    <button
      onClick={() => onClick(artist)}
      className='flex flex-col bg-transparent hover:bg-gradient-to-b from-transparent via-neutral-950 to-neutral-900 hover:bg-opacity-5 rounded-2xl w-[11.5rem] h-[15rem] px-4 py-2 gap-4 hover:border-none transition-all relative group mt-4'
    >
      <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7rem] hover:scale-110 transition-all duration-300">
        <FaPlay className='m-auto shadow-lg fill-black' />
      </div>
      <div className="rounded-full h-[8.75rem] w-[8.75rem] shadow-lg mx-auto overflow-hidden">
        <img
          src={artist.image}
          className="h-full w-full object-cover"
          alt={artist.name}
        />
      </div>
      <div className="flex flex-col text-left">
        <p className='font-bold text-lg'>{truncateTitle(artist.name, 10)}</p>
        <p className='font-bold text-sm text-neutral-400'>Artist</p>
      </div>
    </button>
  );
};

export default ArtistCard;