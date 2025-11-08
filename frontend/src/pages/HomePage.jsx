import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext.jsx";
//import { useDataFetching } from "../hooks/useDataFetching";
import api from "../services/api.js";
import { MdErrorOutline } from "react-icons/md";
import PopularArtists from "../components/Player/PopularArtists.jsx";
import TrendingTracks from "../components/Player/TrendingTracks.jsx";
import Albums from "../components/Player/Albums.jsx";
import Playlists from "../components/Player/Playlists.jsx";
import { useTheme } from "../hooks/useTheme.jsx";

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

/**
 * @func HomePage
 * @description The Music Player Home Component
 * Takes in o props..at least not yet.
 * @returns {React.ReactNode} The Player Home
 */
const HomePage = () => {
  // Constants
  const cardsPerSet = 12;

  const { theme } = useTheme();
  // Main render
  return (
    <div
      id="player-home"
      className="flex flex-col px-5 md:px-10 lg:px-16 gap-10 transition-all duration-300 py-10 max-h-screen overflow-y-scroll"
      data-theme={theme}
    >
      <PopularArtists />
      <TrendingTracks />
      <Albums />
      <Playlists />
    </div>
  );
};

export default HomePage;
