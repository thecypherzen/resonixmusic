import React from 'react';
import SearchBar from './SearchBar';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const TopNav = () => {
  return (
    <div className='flex flex-row bg-transparent items-center p-10 h-[4.375rem] gap-40 '>
      <div className="flex flex-row gap-3">
        {/* Prev arrow */}
        <a href='#' className='flex mx-auto bg-[#212121] rounded-full h-[2.5rem] w-[2.5rem] border-neutral-800 border'>
          <ChevronLeft className='m-auto h-4 w-4' />
        </a>

        {/* Next arrow */}
        <a href='#' className='flex mx-auto bg-[#212121] rounded-full h-[2.5rem] w-[2.5rem] border-neutral-800 border'>
          <ChevronRight className='m-auto h-4 w-4' />
        </a>
      </div>

      {/* Searchbar */}
      <SearchBar />
    </div>
  )
}

export default TopNav;