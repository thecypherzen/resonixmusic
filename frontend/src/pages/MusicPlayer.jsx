import React from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import PlayerHome from '../components/PlayerHome';
import SongList from '../components/SongList';

const MusicPlayer = () => {
  return (
    <div className="max-w-screen flex">
      <SideBar />
      <div className="flex flex-col h-screen ">
        <TopNav />
        <div className="flex flex-row">
          <PlayerHome />
          {/* <SongList className='absolute right-0 top-0' /> */}
        </div>
        <BottomPlayer />
      </div>
    </div>
  );
};

export default MusicPlayer;