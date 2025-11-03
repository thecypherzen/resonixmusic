import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import api from "../services/api";
import { saveAs } from "file-saver";
import { useFetch } from "../hooks/useFetch";
import TracksList from "../components/TracksList";
import UsePlayer from "../hooks/UsePlayer";
import { DetailsPageHeader } from "../components/DetailsPageHeader";
import { UseAppState } from "@/hooks/UseAppState";
import { transformPlaylist, transformTrack } from "@/lib/utils";

const SinglePlaylistPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { selectedPlaylist, setSelectedPlaylist, setSelectedTracks } =
    UseAppState();
  const {} = UsePlayer();
  console.log("\nID:", id);
  const { data: playlist, error } = useFetch({
    url: `/playlists/tracks`,
    method: "get",
    extras: { params: { id: [id] } },
  });

  useEffect(() => {
    if (id === null || id === undefined) return;

    setIsLoading(true); // Reset loading state when ID changes

    if (error) {
      console.error("Error loading playlist:", error);
      setIsLoading(false);
      return;
    }

    if (playlist) {
      console.log("New playlist data received:", playlist[0]);
      const pl = transformPlaylist(playlist[0]);
      setSelectedPlaylist(pl);
      setSelectedTracks(pl.tracks);
      setIsLoading(false);
    }
  }, [id, playlist, error]); // Remove selectedPlaylist and isLoading from dependencies
  useEffect(() => {
    console.log(
      "----> selectedPlaylist.id: ",
      selectedPlaylist?.id,
      "URL Id:",
      id
    );
  }, [selectedPlaylist]);

  if (isLoading) return <LoadingState />;
  if (!isLoading && !selectedPlaylist) return <div>Playlist not found</div>;

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-3.5rem-26px)]">
      <div className="flex flex-col">
        <DetailsPageHeader type="playlist" dataSet={selectedPlaylist} />
        <TracksList tracks={selectedPlaylist.tracks.map(transformTrack)} />
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col min-h-screen bg-neutral-900 p-6 animate-pulse">
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col bg-neutral-900 p-6 animate-pulse">
        <div className="flex flex-col gap-4">
          <div className="w-20 h-6 bg-neutral-800 rounded"></div>
          <div className="w-96 h-24 bg-neutral-800 rounded"></div>
          <div className="w-64 h-6 bg-neutral-800 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

//const ErrorMessage = ({ message }) => (
//  <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed">
//    <div className="text-neutral-600 flex flex-col items-center">
//      <MdErrorOutline size={102} className="m-auto" />
//      <p className="text-2xl mb-2 font-extrabold">Unable to load content</p>
//      <p className="text-sm">{message}</p>
//      <button
//        onClick={() => window.location.reload()}
//        className="text-sm mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
//      >
//        Retry
//      </button>
//    </div>
//  </div>
//);

export default SinglePlaylistPage;
