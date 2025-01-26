import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaEllipsisH, FaClock, FaDownload } from 'react-icons/fa';
import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';
import { saveAs } from 'file-saver';

const PlaylistDetails = () => {
  const player = usePlayer();
  const { handleTrackSelect, currentTrack, isPlaying } = player;
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!id) return;
      const thumbnail = await api.getRandomImage('squarish');
      const image = await api.getRandomImage('landscape');
      try {
        setLoading(true);
        const response = await api.getPlaylistDetails(id);

        if (response.data) {
          const playlistData = response.data;
          setPlaylist({
            ...playlistData,
            thumbnail,
            image
          });

          if (playlistData.tracks) {
            setTracks(playlistData.tracks);
          }
        } else {
          throw new Error('Playlist not found');
        }
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  const handlePlayAll = () => {
    if (!tracks.length) return;
    try {
      handleTrackSelect(tracks[0], tracks);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const handlePlayTrack = (track, index) => {
    try {
      handleTrackSelect(track, tracks);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownloadTrack = async (track) => {
    if (!track.audio) {
      console.error('No download URL available');
      return;
    }

    try {
      const response = await fetch(track.audio);
      const blob = await response.blob();
      saveAs(blob, `${track.name}.mp3`);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadPlaylist = async () => {
    if (!tracks.length) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    try {
      const downloadPromises = tracks.map(async (track) => {
        if (!track.audio) return;
        const response = await fetch(track.audio);
        const blob = await response.blob();
        zip.file(`${track.name}.mp3`, blob);
      });

      await Promise.all(downloadPromises);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${playlist.name}.zip`);
    } catch (error) {
      console.error('Playlist download failed:', error);
    }
  };

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="flex flex-col bg-transparent px-10 -mt-16">
        {/* Playlist Header */}
        <div className="flex items-end gap-6 p-6 h-[20rem] bg-transparent">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-[10.75rem] h-[10.75rem] shadow-2xl rounded-lg"
          />
          <div className="flex flex-col gap-3">
            <span className="text-md font-bold">Playlist</span>
            <h1 className="text-[5rem] font-bold leading-tight">
              {truncateTitle(playlist.title, 15)}
            </h1>
            <div className="flex items-center gap-2 text-md">
              <img
                src={playlist.thumbnail}
                alt={playlist.user_name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-bold hover:underline cursor-pointer">
                {playlist.user_name}
              </span>
              <span className="text-neutral-400">
                {new Date(playlist.creationDate).getFullYear()}
              </span>
              <span className="text-neutral-400">• {tracks.length} songs</span>
            </div>
          </div>
        </div>

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
            <FaHeart size={24} className='hover:fill-red-500' />
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
        <div className="px-6 pb-36">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-neutral-400 border-b border-neutral-800 transition-all duration-300">
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Plays</th>
                <th className="px-4 py-2 text-center">Download</th>
                <th className="px-4 py-2 text-right">
                  <FaClock className="ml-auto mr-2.5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr
                  key={track.id}
                  className="group hover:bg-neutral-800/50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <td className="px-4 py-3 text-neutral-400 w-12">
                    <div className="relative w-4">
                      {isPlaying && currentTrack?.id === track.id ? (
                        <FaPause className="text-[#08B2F0]" />
                      ) : (
                        <>
                          <span className="group-hover:hidden">{index + 1}</span>
                          <FaPlay className="hidden group-hover:block absolute -top-2 text-white" />
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={track.image}
                          alt={track.name}
                          className={`w-10 h-10 rounded ${player.isLoading && currentTrack?.id === track.id ? 'opacity-50' : ''}`}
                        />
                        {player.isLoading && currentTrack?.id === track.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-normal ${currentTrack?.id === track.id ? 'text-[#08B2F0]' : ''}`}>
                          {track.name}
                        </span>
                        <span className="text-sm text-neutral-400">
                          {track.artist_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {track.likes || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadTrack(track);
                      }}
                      className="bg-transparent text-neutral-400 hover:text-[#08B2F0] transition-colors"
                    >
                      <FaDownload size={16} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-400">
                    {formatDuration(track.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed">
    <div className="text-neutral-600 flex flex-col items-center">
      <MdErrorOutline size={102} className='m-auto' />
      <p className="text-2xl mb-2 font-extrabold">Unable to load content</p>
      <p className="text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

export default PlaylistDetails;
