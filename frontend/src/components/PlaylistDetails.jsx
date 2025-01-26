import React, { useState, useEffect } from 'react';
import { FaPlay, FaHeart, FaEllipsisH, FaClock } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { MdErrorOutline } from "react-icons/md";
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';
import { usePlaylistThumbnail } from '../hooks/usePlaylistThumbnail';

const CURRENT_DATE = '2025-01-23 01:20:24';
const CURRENT_USER = 'gabrielisaacs';

const PlaylistDetails = () => {
  const { setCurrentTrack, setQueue, currentTrack } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  console.log('GETTING DETAILS FOR PLAYLIST:\n\t', id);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      if (!id) return;
      const thumbnail = await api.getRandomImage('squarish');
      const image = await api.getRandomImage('landscape');
      try {
        setLoading(true);
        const response = await api.getPlaylistDetails(id);
        console.log('Playlist details data:', response?.data ?? 'NONE');

        if (response.data) {
          const playlistData = response.data; // Get the first playlist from results
          setPlaylist({
            ...playlistData,
            thumbnail,
            image
          });

          // Fetch tracks for the playlist
          if (playlistData.tracks) {
            setTracks(playlistData.tracks);
          }
          console.log(`PLAYLIST ${id} TRACKS: \n\t`, playlistData.tracks);
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
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setQueue(tracks.slice(1));
    }
  };

  const handlePlayTrack = (track, index) => {
    setCurrentTrack(track);
    setQueue(tracks.slice(index + 1));
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

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error} />;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="flex flex-col bg-transparent px-10">
        {/* Playlist Header */}
        <div className="flex items-end gap-6 p-6 h-[20rem] bg-gradient-to-b from-neutral-800/50 to-[#121212]">
          <img
            src={playlist.thumbnail}
            alt={playlist?.name}
            className="w-[10.75rem] h-[10.75rem] shadow-2xl rounded-lg"
          />
          <div className="flex flex-col gap-3">
            <span className="text-md font-bold">Playlist</span>
            <h1 className="text-[5rem] font-bold leading-tight">
              {truncateTitle(playlist?.name, 15)}
            </h1>
            <div className="flex items-center gap-2 text-md">
              <img
                src={playlist.thumbnail}
                alt={playlist?.user_name}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-bold hover:underline cursor-pointer">
                {playlist?.user_name}
              </span>
              <span className="text-neutral-400">
                { console.log('CREATIONDATE', playlist.creationDate) }
                {new Date(playlist?.creationDate).getFullYear()}
              </span>
              <span className="text-neutral-400">• {playlist.tracks.length} songs</span>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-8 p-6">
          <button
            onClick={handlePlayAll}
            className="w-42 h-12 flex items-center justify-center bg-transparent hover:bg-neutral-800 border border-neutral-600 rounded-full hover:scale-105 transition-all duration-300 text-white text-sm px-10 gap-2"
          >
            <FaPlay />
            Play all
          </button>
          <button className="bg-transparent text-white">
            <FaHeart size={24} className='hover:fill-red-500' />
          </button>
          <button className="bg-transparent text-white">
            <FaEllipsisH size={24} />
          </button>
        </div>

        {/* Tracks List */}
        <div className="px-6 pb-36">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-neutral-400 border-b border-neutral-800">
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Artist</th>
                <th className="px-4 py-2 text-right">
                  <FaClock className="ml-auto mr-2.5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track, index) => (
                <tr
                  key={track.id}
                  className="group hover:bg-neutral-800/50 rounded-lg transition-colors"
                  onClick={() => handlePlayTrack(track, index)}
                >
                  <td className="px-4 py-3 text-neutral-400 w-12">
                    <div className="relative w-4">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <FaPlay className="hidden group-hover:block absolute -top-2 text-white" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={track.image}
                        alt={track.name}
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex flex-col">
                        <span className={`font-normal ${currentTrack?.id === track.id ? 'text-[#08B2F0]' : ''}`}>
                          {track.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {track.artist_name}
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
