import React from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import AlbumDetails from '../components/AlbumDetails';

const AlbumDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen w-screen bg-[#121212] relative">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-[calc(100vh-90px)] w-[14rem] z-30">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[14rem] relative">
        {/* Top Navigation - Fixed position */}
        <div className="fixed top-0 right-0 left-[14rem] h-[4rem] z-20 bg-[#121212]">
          <TopNav />
        </div>

        {/* Main Content Area */}
        <div className="mt-[4rem] pb-[90px]">
          <AlbumDetails id={id} />
        </div>

        {/* Bottom Player */}
        <div className="fixed bottom-0 left-0 right-0 h-[90px] z-50">
          <BottomPlayer />
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailsPage;