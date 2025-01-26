import React from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import PlaylistDetails from '../components/PlaylistDetails';

const PlaylistPage = () => {
  return (
    <div className="flex min-h-screen w-screen bg-[#121212]">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-[calc(100vh-7rem)] w-[15rem] z-30">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[15rem]">
        {/* Top Navigation */}
        <div className="fixed top-0 right-0 left-[15rem] h-16 z-20 bg-[#121212]">
          <TopNav />
        </div>

        {/* Main Content Area */}
        <div className="mt-16 pb-28">
          <PlaylistDetails />
        </div>

        {/* Bottom Player */}
        <div className="fixed bottom-0 left-0 right-0 h-28 z-50">
          <BottomPlayer />
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;