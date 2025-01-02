import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none'); // none, one, all
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]); // Track history for previous function
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(new Audio());

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0) {
        playNext();
      } else if (repeat === 'all') {
        // Add the current track back to the end of the queue
        setQueue(prevQueue => [...prevQueue, currentTrack]);
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, queue, repeat]);

  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
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
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length > 0) {
      setHistory(prevHistory => [...prevHistory, currentTrack]);
      const nextTrack = shuffle ? queue.splice(Math.floor(Math.random() * queue.length), 1)[0] : queue.shift();
      setCurrentTrack(nextTrack);
    }
  };

  const playPrevious = () => {
    if (history.length > 0) {
      const previousTrack = history.pop();
      setCurrentTrack(previousTrack);
      setHistory([...history]);
    } else {
      audioRef.current.currentTime = 0;
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none');
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
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
    seekTo
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