import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className='flex w-[37.5rem] bg-[#1F1F22] h-[2.5rem] rounded-xl border border-neutral-800 m-4 items-center p-4' >
      <Search className='w-4 h-4' />
      <input type='search' name="searchbar" id="searchbar" className='bg-transparent w-full focus:outline-none p-2' />
    </div>
  )
}

export default SearchBar;