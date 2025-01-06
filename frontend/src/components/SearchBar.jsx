import React from 'react';
import { LuSearch } from "react-icons/lu";

const SearchBar = () => {
  return (
    <div className='flex bg-[#212121] h-[2.5rem] rounded-xl border border-neutral-800 m-4 items-center p-4 transition-all duration-300 hover:w-[30rem] focus-within:w-[30rem] w-[20rem]'>
      <LuSearch className='w-4 h-4' />
      <input
        type='search'
        name='searchbar'
        id='searchbar'
        placeholder='Search'
        className='bg-transparent w-full focus:outline-none p-2 placeholder:text-sm'
      />
    </div>
  );
};

export default SearchBar;