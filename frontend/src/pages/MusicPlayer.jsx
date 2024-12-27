import React from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';

const MusicPlayer = () => {
  return (
    <div className="max-w-screen flex">
      <SideBar />
      <div className="flex flex-col h-screen">
        <TopNav />
        <BottomPlayer />
      </div>
    </div>
  );
};

export default MusicPlayer;