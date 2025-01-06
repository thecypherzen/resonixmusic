import React from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import SongDetails from '../components/SongDetails';

const SongDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen w-screen bg-[#121212]">
      <SideBar />
      <div className="flex-1 ml-[15rem]">
        <TopNav />
        <main className="px-8 pb-[7rem]">
          <SongDetails songId={id} />
        </main>
        <BottomPlayer />
      </div>
    </div>
  );
};

export default SongDetailsPage;