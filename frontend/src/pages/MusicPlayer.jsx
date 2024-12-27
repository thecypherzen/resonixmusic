import React from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';

const MusicPlayer = () => {
  return (
    <div className="w-screen flex">
      <SideBar />
      <TopNav />
    </div>
  );
};

export default MusicPlayer;