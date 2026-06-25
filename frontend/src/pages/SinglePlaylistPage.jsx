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
  const [error, setError] = useState(null);
  const {
    selectedPlaylist,
    setSelectedPlaylist,
    selectedTracks: playlistTracks,
    setSelectedTracks: setPlaylistTracks,
  } = UseAppState();

  const { data: playlistWithTracks, error: playlistWithTracksErr } = useFetch({
    url: "/playlists/tracks",
    method: "get",
    extras: { params: { id: [id] } },
  });
  const { data: tracks, error: tracksError } = useFetch(
    {
      url: `/tracks`,
      method: "get",
      extras: { params: { id: selectedPlaylist?.tracks } },
    },
    !!!selectedPlaylist,
    [selectedPlaylist],
  );
  useEffect(() => {
    if (id === null || id === undefined) return;
    if (playlistWithTracksErr) {
      console.error(
        "Failed to fetch playlist with tracks:",
        playlistWithTracksErr,
      );
      setError(playlistWithTracksErr);
      return;
    }
    if (playlistWithTracks) {
      console.log("----> playlist with tracks: ", playlistWithTracks);
      setSelectedPlaylist(transformPlaylist(playlistWithTracks[0]));
    }
  }, [playlistWithTracks]);

  useEffect(() => {
    if (selectedPlaylist) {
      //console.log("----> selected playlist: ", selectedPlaylist);
      if (tracksError) {
        setError(tracksError);
        return;
      }
      if (tracks) {
        //console.log("----> playlist tracks: ", tracks);
        setPlaylistTracks(tracks.map(transformTrack));
      }
    }
  }, [selectedPlaylist, tracks]);

  useEffect(() => {
    if (playlistTracks || error) {
      setIsLoading(false);
    }
  }, [playlistTracks, error]);

  if (isLoading) return <LoadingState />;
  if (error) return <div>{error?.message ?? "A loading error occured"}</div>;

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-3.5rem-26px)]">
      <div className="flex flex-col">
        <DetailsPageHeader
          type="playlist"
          dataSet={selectedPlaylist}
          tracksCount={playlistTracks.length ?? 0}
          namespace="playlists"
        />
        <TracksList tracks={playlistTracks} />
      </div>
    </div>
  );
};

export const LoadingState = () => (
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
