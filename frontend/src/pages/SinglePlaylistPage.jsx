import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import api from "../services/api";
import { saveAs } from "file-saver";
import { useFetch } from "../hooks/useFetch";
import TracksList from "../components/TracksList";
import UsePlayer from "../hooks/UsePlayer";
import {
  DetailsPageControls,
  DetailsPageHeader,
} from "../components/DetailsPageComponents";
import { UseAppState } from "@/hooks/UseAppState";

const SinglePlaylistPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { selectedPlaylist, setTracks, setSelectedPlaylist } = UseAppState();
  const {} = UsePlayer();

  const { data: playlistData, error: playlistError } = !selectedPlaylist
    ? useFetch({
        url: `/playlists`,
        method: "get",
        extras: { params: { id: [id] } },
      })
    : { data: null, error: null };

  const { data: tracks, error: tracksError } = selectedPlaylist
    ? useFetch({
        url: `/playlists/${selectedPlaylist?.id}/tracks`,
        method: "get",
      })
    : { data: null, error: null };

  useEffect(() => {
    if (id === null || id === undefined) return;

    if (playlistError) {
      console.error("Playlist fetch error:", playlistError);
      setIsLoading(false);
      return;
    }
    if (playlistData && !selectedPlaylist) {
      console.log("freshly selected playlist:", playlistData);
      setSelectedPlaylist(playlistData);
    }
    if (tracksError) {
      console.error("Tracks fetch error:", tracksError);
      setIsLoading(false);
      return;
    }
    if (tracks) {
      setTracks(tracks);
      setIsLoading(false);
    }
  }, [id, playlistData, tracks, tracksError, playlistError, isLoading]);

  if (isLoading) return <LoadingState />;
  if (!isLoading && !selectedPlaylist) return <div>Playlist not found</div>;

  return (
    <div className="flex-1 overflow-y-auto w-full border-1 border-orange-500">
      <div className="flex flex-col bg-transparent px-10 -mt-16">
        {/* Playlist Header */}
        <DetailsPageHeader type="playlist" dataSet={selectedPlaylist} />
        {/* Player Controls */}
        <DetailsPageControls collection={selectedPlaylist} type="playlist" />
        {/* Tracks List */}
        <TracksList tracks={tracks} />
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
