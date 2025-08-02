import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
//import { useDataFetching } from "../hooks/useDataFetching";
import api from "../services/api";
import { MdErrorOutline } from "react-icons/md";
import PlaylistCard from "./PlaylistCard";
import ArtistCard from "./ArtistCard";
import helpers from "../utils/utilityFunctions.js";
import PopularArtists from "./Player/PopularArtists.jsx";
import TrendingTracks from "./Player/TrendingTracks.jsx";
import Albums from "./Player/Albums.jsx";
import Playlists from "./Player/Playlists.jsx";

// Constants
const CURRENT_DATE = "2025-01-23 00:03:46";
const CURRENT_USER = "gabrielisaacs";
const DEFAULT_THUMBNAIL = "/thumbnail.png";

// Error message component with retry capability
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex justify-center items-center p-4 bg-neutral-900 rounded-lg border-1 border-green-300">
    <div className="text-neutral-400 flex flex-col items-center">
      <MdErrorOutline size={24} className="mb-2" />
      <p className="text-sm mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm px-4 py-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Section component with error handling and retry capability
//const ContentSection = ({ title, loading, error, data, onRetry, children }) => {
//  if (loading) return <SectionLoadingMessage />;
//  if (error) return <ErrorMessage message={error.message} onRetry={onRetry} />;
//  if (!data?.length) return null;

//  return (
//    <div className="flex flex-col mb-10">
//      <h2 className="text-3xl font-extrabold mb-4">{title}</h2>
//      {children}
//    </div>
//  );
//};

/**
 * @func PlayerHome
 * @description The Music Player Home Component
 * Takes in o props..at least not yet.
 * @returns {React.ReactNode} The Player Home
 */
const PlayerHome = () => {
  const { handleTrackSelect } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("PLAYER HOME PAGE LOADED");
  }, []);

  // Constants
  const cardsPerSet = 5;

  // Navigation handlers
  const handleNext = (setVisible, visible, totalItems) => {
    if (visible + cardsPerSet < totalItems) {
      setVisible(visible + cardsPerSet);
      const section = document.getElementById("section-id");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handlePrevious = (setVisible, visible) => {
    if (visible - cardsPerSet >= 0) {
      setVisible(visible - cardsPerSet);
      // Optional: Smooth scroll to the section
      const section = document.getElementById("section-id");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Playback handlers
  const handlePlaySong = (song, index) => {
    const trackToPlay = {
      id: song.id,
      title: song.title || song.name,
      artist: song.artist || song.artist_name,
      artwork: song.thumbnail || song.image || DEFAULT_THUMBNAIL,
      url: song.url || song.audio,
      duration: song.duration,
      stream_url: song.url || song.audio,
    };

    // Create remaining tracks array
    const remainingTracks = transformedTrending
      .slice(index + 1)
      .map((track) => ({
        id: track.id,
        title: track.title || track.name,
        artist: track.artist || track.artist_name,
        artwork: track.thumbnail || track.image || DEFAULT_THUMBNAIL,
        url: track.url || track.audio,
        duration: track.duration,
        stream_url: track.url || track.audio,
      }));

    handleTrackSelect(trackToPlay, remainingTracks);
    navigate(`/song/${song.id}`);
  };

  const handlePlayAll = () => {
    if (transformedTrending.length > 0) {
      const firstTrack = transformedTrending[0];
      const trackToPlay = {
        id: firstTrack.id,
        title: firstTrack.title || firstTrack.name,
        artist: firstTrack.artist || firstTrack.artist_name,
        artwork: firstTrack.thumbnail || firstTrack.image || DEFAULT_THUMBNAIL,
        url: firstTrack.url || firstTrack.audio,
        duration: firstTrack.duration,
        stream_url: firstTrack.url || firstTrack.audio,
      };

      const remainingTracks = transformedTrending.slice(1).map((track) => ({
        id: track.id,
        title: track.title || track.name,
        artist: track.artist || track.artist_name,
        artwork: track.thumbnail || track.image || DEFAULT_THUMBNAIL,
        url: track.url || track.audio,
        duration: track.duration,
        stream_url: track.url || track.audio,
      }));

      handleTrackSelect(trackToPlay, remainingTracks);
    }
  };

  // Main render
  return (
    <div className="max-w-[60rem] min-h-screen flex flex-col mt-6 mx-16 gap-10 transition-all duration-300">
      <PopularArtists cardsPerSet={cardsPerSet} />
      <TrendingTracks />
      <Albums cardsPerSet={cardsPerSet} />
      <Playlists cardsPerSet={cardsPerSet} />
    </div>
  );
};

export default PlayerHome;
