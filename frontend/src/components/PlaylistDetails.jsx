import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaEllipsisH,
  FaDownload,
} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import api from "../services/api";
import { saveAs } from "file-saver";
import { useFetch } from "../hooks/useFetch";
import TracksList from "./TracksList";
import UsePlayer from "../hooks/UsePlayer";

const PlaylistDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [dataState, setDataState] = useState({
    error: null,
    playlistInfo: null,
    playlistTracks: null,
  });
  const {} = UsePlayer();

  useEffect(() => {
    setIsLoading(true);
    if (id === null || id === undefined) return;
    try {
      const { data: playListData, error: playListDataError } = useFetch({
        url: "/playlists",
        method: "get",
        params: { id: [parseInt(id)] },
      });
      if (error) {
        setDataState((prev) => {
          return { ...prev, error: playListDataError };
        });
      } else {
        // fetch playlist tracks
        const { data: tracks, error: tracksError } = useFetch({
          url: "/playlists/tracks",
          method: "get",
          extras: {
            params: {
              id: [parseInt(id)],
            },
          },
        });
        if (tracksError) {
          setDataState((prev) => {
            return { ...prev, error: tracksError };
          });
        } else {
          setDataState((prev) => {
            return {
              ...prev,
              error: null,
              playlistInfo: playListData[0],
              playlistTracks: tracks,
            };
          });
        }
      }
    } catch (err) {
      setDataState((prev) => {
        return { ...prev, error: err };
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (dataState.error) {
      console.error("Error loading playlist:", dataState.error);
    } else {
      if (dataState.playlistInfo) {
        console.log("Playlist Info:", dataState.playlistInfo);
        console.log("Playlist Tracks:", dataState.playlistTracks);
      }
    }
  }, [dataState.error, dataState.playlistInfo, dataState.playlistTracks]);

  //const formatDuration = (seconds) => {
  //  const minutes = Math.floor(seconds / 60);
  //  const remainingSeconds = seconds % 60;
  //  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  //};

  if (isLoading) return <LoadingState />;
  if (!dataState.playlistInfo) return <div>Playlist not found</div>;

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="flex flex-col bg-transparent px-10 -mt-16">
        {/* Playlist Header */}
        <DetailsPageHeader type="playlist" dataSet={playlist} />
        {/* Player Controls */}
        <div className="flex items-center gap-8 p-6">
          <button
            onClick={handlePlayAll}
            className="w-42 h-12 flex items-center justify-center bg-[#08B2F0] hover:bg-opacity-80 rounded-full transition-all duration-300 text-black text-sm px-10 gap-2"
            disabled={!tracks.length}
          >
            {isPlaying && currentTrack?.id === tracks[0]?.id ? (
              <>
                <FaPause /> Pause
              </>
            ) : (
              <>
                <FaPlay /> Play all
              </>
            )}
          </button>
          <button className="bg-transparent text-white">
            <FaHeart size={24} className="hover:fill-red-500" />
          </button>
          <button
            onClick={handleDownloadPlaylist}
            className="bg-transparent text-white hover:text-[#08B2F0] transition-colors"
          >
            <FaDownload size={24} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="bg-transparent hover:bg-white/10 p-2 rounded-full"
            >
              <FaEllipsisH size={24} />
            </button>
            {showMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-xl border border-neutral-600 z-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add share functionality here
                    setShowMenu(false);
                  }}
                  className="bg-transparent w-full text-left px-4 py-3 hover:bg-white/10 rounded-none"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>

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

export default PlaylistDetails;
