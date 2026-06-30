import React, { useState, useEffect, useRef } from "react";
import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import api from "../services/api";
import { saveAs } from "file-saver";
import { LoadingState } from "./ContentSection";
import TracksList from "./TracksList";

const AlbumDetails = ({ id }) => {
  const player = usePlayer();
  const { handleTrackSelect, currentTrack, isPlaying } = player;
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.getAlbumDetails(id);
        console.log("Album details response:", response);

        if (response.data) {
          setAlbum(response.data.album);
          setTracks(response.data.tracks || []);
        } else {
          throw new Error("No album data received");
        }
      } catch (err) {
        console.error("Error fetching album details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handlePlayAll = () => {
    if (!tracks.length) return;
    try {
      handleTrackSelect(tracks[0], tracks);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const handlePlayTrack = (track, index) => {
    try {
      handleTrackSelect(track, tracks);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDownloadTrack = async (track) => {
    if (!track.download_url) {
      console.error("No download URL available");
      return;
    }

    try {
      const response = await fetch(track.download_url);
      const blob = await response.blob();
      saveAs(blob, `${track.title}.mp3`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadAlbum = async () => {
    if (!tracks.length) return;

    // Create a zip file of all tracks
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    try {
      // Add all tracks to zip
      const downloadPromises = tracks.map(async (track) => {
        if (!track.download_url) return;

        const response = await fetch(track.download_url);
        const blob = await response.blob();
        zip.file(`${track.title}.mp3`, blob);
      });

      await Promise.all(downloadPromises);

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${album.title}.zip`);
    } catch (error) {
      console.error("Album download failed:", error);
    }
  };

  const truncateTitle = (title, maxLength) => {
    if (!title) return "";
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  if (loading) return <LoadingState component="artist-details" />;
  if (error) return <ErrorMessage message={error} />;
  if (!album) return <div>Album not found</div>;

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="flex flex-col bg-transparent px-10 -mt-16">
        <p>
          Use <span>SingleAlbumPage</span>&nbsp;instead
        </p>
        {/* Tracks List */}
        {/*<TracksList
          tracks={tracks}
          artistPerTrack={false}
          className="border border-red-500"
        />*/}
      </div>
    </div>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed"></div>
);

export default AlbumDetails;
