import React, { createContext, useContext, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none'); // none, one, all
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef(new Audio());

  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue(queue.slice(1));
    }
  };

  const playPrevious = () => {
    // Implement previous track logic
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none');
  };

  const value = {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    playNext,
    playPrevious,
    queue,
    setQueue,
    currentTime,
    duration,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};