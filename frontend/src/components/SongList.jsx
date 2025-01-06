import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const SongList = () => {
  const { queue, handleTrackSelect } = usePlayer();

  return (
    <div className="h-full p-6 flex flex-col">
      <div className="mb-4 -mt-3">
        <h2 className="text-xl font-semibold">Up Next</h2>
        <p className="text-sm text-neutral-400">{queue.length} in queue</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 divide-y divide-neutral-800 divide-solid">
        {queue.map((track, index) => (
          <div
            key={track.id || index}
            className="flex items-center space-x-4 py-2  cursor-pointer transition-all hover:opacity-50"
            onClick={() => handleTrackSelect(track, queue)}
          >
            <img
              src={track.artwork}
              alt={track.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div>
              <p className="font-medium line-clamp-1">{track.title}</p>
              <p className="text-sm text-neutral-400 line-clamp-1">
                {track.artist}
              </p>
            </div>
          </div>
        ))}

        {queue.length === 0 && (
          <div className="text-center text-neutral-400 mt-8">
            <p>No songs in queue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongList;