import React from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import AlbumDetails from '../components/AlbumDetails';

const AlbumDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen w-screen bg-[#121212]">
      <SideBar />
      <div className="flex-1 ml-[14rem]">
        <TopNav />
        <main className="pb-[7rem]">
          <AlbumDetails id={id} />
        </main>
        <BottomPlayer />
      </div>
    </div>
  );
};

export default AlbumDetailsPage;