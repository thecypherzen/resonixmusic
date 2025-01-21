import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FaPlay } from "react-icons/fa";
import { usePlayer } from '../context/PlayerContext';
import { usePlaylistThumbnail } from '../hooks/usePlaylistThumbnail';

const PlaylistDetails = () => {
  const { id } = useParams();
  const { handleTrackSelect } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const thumbnail = usePlaylistThumbnail(id);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setLoading(true);
        const response = await api.getPlaylistDetails(id);
        console.log('Playlist details:', response);

        if (response.data?.playlist) {
          setPlaylist(response.data.playlist);
          setTracks(response.data.tracks || []);
        } else {
          throw new Error('Playlist not found');
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  const handlePlayTrack = (track, index) => {
    const trackToPlay = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.thumbnail || thumbnail,
      url: track.url,
      duration: track.duration,
      stream_url: track.url
    };

    const remainingTracks = tracks
      .slice(index + 1)
      .map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        artwork: t.thumbnail || thumbnail,
        url: t.url,
        duration: t.duration,
        stream_url: t.url
      }));

    handleTrackSelect(trackToPlay, remainingTracks);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div className="max-w-[60rem] min-h-screen flex flex-col mt-6 mx-16 gap-10">
      <div className="flex gap-8">
        <img
          src={thumbnail || '/thumbnail.png'}
          alt={playlist.title}
          className="w-60 h-60 rounded-xl shadow-lg"
        />
        <div className="flex flex-col justify-end">
          <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
          <p className="text-neutral-400">Created by {playlist.artist}</p>
          <p className="text-neutral-400">{tracks.length} tracks</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => handlePlayTrack(track, index)}
            className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-[2%] rounded-xl group transition-all"
          >
            <div className="relative">
              <img
                src={track.thumbnail || thumbnail || '/thumbnail.png'}
                alt={track.title}
                className="w-12 h-12 rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPlay className="text-white" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{track.title}</span>
              <span className="text-sm text-neutral-400">{track.artist}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetails;