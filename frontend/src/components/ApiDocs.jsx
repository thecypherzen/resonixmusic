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
        <div className="w-screen h-full bg-[#000]">
          <iframe
            src={docsUrl.toString()}
            title="Resonix API Documentation"
            className="w-screen h-full border-0 pb-[3.8rem] pr-[15.5rem] pl-8 bg-[#000]"
            style={{
              height: '100vh',
              backgroundColor: '#000'
            }}
          />
        </div>
        <BottomPlayer />
      </div>
    </div>
  );
};

export default ApiDocs;