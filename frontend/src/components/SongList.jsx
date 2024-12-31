import React from 'react';

function SongList() {
  return (
    <div className='flex flex-col min-h-screen min-w-[16rem] p-6 bg-transparent right-0 mb-6
'>
      <p className="text-white">Playlist</p>
      <div className="flex flex-col gap-6 my-6 text-[0.875rem]">
        <p className="text-white opacity-40 text-xs font-400 -mb-2">MY COLLECTION</p>
        <div className="flex flex-col ml-2">

        </div>
      </div>
    </div>
  )
}

export default SongList;