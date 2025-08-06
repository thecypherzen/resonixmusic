import React from "react";
import { useParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import BottomPlayer from "../components/BottomPlayer";
import ArtistDetails from "../components/ArtistDetails";

const ArtistPage = () => {
  const { id } = useParams();
  console.log("USERID:", id);
  return (
    <div className="flex min-h-screen w-screen bg-[#121212]">
      {/* Artist Content */}
      <div className="mt-[4rem] pb-[90px] relative">
        <ArtistDetails id={id} />
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 h-[90px] z-50">
        <BottomPlayer />
      </div>
    </div>
  );
};

export default ArtistPage;
