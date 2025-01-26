import React from 'react';
import SideBar from '../components/SideBar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';

const ApiDocs = () => {
  // Use URL constructor to add dark theme parameter
  const docsUrl = new URL('http://localhost:5001/docs');
  docsUrl.searchParams.append('theme', 'dark');

  return (
    <div className="flex overflow-hidden">
      <SideBar />
      <div className="flex flex-col max-h-screen w-full ml-[15rem]">
        <TopNav />
        <div className="w-screen h-full pr-[15.5rem] pb-[5rem] bg-[#1a1a1a]">
          <iframe
            src={docsUrl.toString()}
            title="Resonix API Documentation"
            className="w-full h-full border-0 bg-[#000]"
            style={{
              height: 'calc(100vh - 5rem)',
              backgroundColor: '#1a1a1a'
            }}
          />
        </div>
        <BottomPlayer />
      </div>
    </div>
  );
};

export default ApiDocs;