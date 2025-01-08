import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Play, Plus } from 'lucide-react';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, setQueue } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', url: '' });

  useEffect(() => {
    const fetchedPlaylist = {
      id,
      title: `Playlist ${id}`,
      description: 'A great playlist',
      tracks: [
        { id: 1, title: 'Song 1', artist: 'Artist 1', url: '/path/to/song1.mp3' },
        { id: 2, title: 'Song 2', artist: 'Artist 2', url: '/path/to/song2.mp3' },
        // Add more tracks as needed
      ],
    };
    setPlaylist(fetchedPlaylist);
  }, [id]);

  const handlePlayAll = () => {
    if (playlist && playlist.tracks.length > 0) {
      play(playlist.tracks[0], playlist.tracks); // Play the first track and set the queue
    }
  };

  const handleAddTrack = () => {
    if (newTrack.title && newTrack.artist && newTrack.url) {
      setPlaylist({
        ...playlist,
        tracks: [...playlist.tracks, { id: playlist.tracks.length + 1, ...newTrack }],
      });
      setNewTrack({ title: '', artist: '', url: '' });
    }
  };

  if (!playlist) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{playlist.title}</h1>
        <button
          onClick={handlePlayAll}
          className="px-4 py-2 bg-[#08B2F0] text-white rounded-full flex items-center gap-2"
        >
          <Play size={16} />
          Play All
        </button>
      </div>
      <p className="text-neutral-400 mb-4">{playlist.description}</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Track</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTrack.title}
          onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
          className="p-2 bg-neutral-800 rounded-lg text-white mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Artist"
          value={newTrack.artist}
          onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
          className="p-2 bg-neutral-800 rounded-lg text-white mb-2 w-full"
        />
        <input
          type="text"
          placeholder="URL"
          value={newTrack.url}
          onChange={(e) => setNewTrack({ ...newTrack, url: e.target.value })}
          className="p-2 bg-neutral-800 rounded-lg text-white mb-2 w-full"
        />
        <button
          onClick={handleAddTrack}
          className="px-4 py-2 bg-[#08B2F0] text-white rounded-full flex items-center gap-2"
        >
          <Plus size={16} />
          Add Track
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Tracks</h2>
        {playlist.tracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded-lg mb-2">
            <div>
              <p className="text-white">{track.title}</p>
              <p className="text-neutral-400">{track.artist}</p>
            </div>
            <button
              onClick={() => play(track, playlist.tracks)}
              className="px-4 py-2 bg-[#08B2F0] text-white rounded-full flex items-center gap-2"
            >
              <Play size={16} />
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;