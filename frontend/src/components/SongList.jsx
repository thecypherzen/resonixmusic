import React from 'react';
import { FaPlay, FaClock } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';

const SongList = () => {
  const { queue, currentTrack, handleTrackSelect } = usePlayer();

  const handlePlayTrack = (track, index) => {
    const trackToPlay = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork || track.thumbnail,
      url: track.url || track.audio,
      stream_url: track.url || track.audio,
      duration: track.duration
    };

    // remaining tracks
    const remainingTracks = queue.slice(index + 1).map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      artwork: t.artwork || t.thumbnail,
      url: t.url || t.audio,
      stream_url: t.url || t.audio,
      duration: t.duration
    }));

    handleTrackSelect(trackToPlay, remainingTracks);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="mb-4 px-6 pt-4">
        <h2 className="text-xl font-semibold">Up Next</h2>
        <p className="text-sm text-neutral-400">{queue.length} in queue</p>
      </div>

      {queue.length > 0 ? (
        <div className="px-6 pb-6 flex-1 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-neutral-400 border-b border-neutral-800 transition-all duration-300">
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-right">
                  <FaClock className="ml-auto mr-2.5" />
                </th>
              </tr>
            </thead>
            <tbody>
              {queue.map((track, index) => (
                <tr
                  key={track.id || index}
                  className="group hover:bg-neutral-800/50 rounded-lg transition-colors cursor-pointer"
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
                        src={track.artwork || track.thumbnail}
                        alt={track.title}
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex flex-col">
                        <span className={`font-normal ${currentTrack?.id === track.id ? 'text-[#08B2F0]' : ''
                          }`}>
                          {track.title}
                        </span>
                        <span className="text-sm text-neutral-400">
                          {track.artist}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-400">
                    {formatDuration(track.duration || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-400">
          <p>No songs in queue</p>
        </div>
      )}
    </div>
  );
};

export default SongList;