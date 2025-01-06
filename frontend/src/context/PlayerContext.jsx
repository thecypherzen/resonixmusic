import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none');
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  // Handle track selection and queue management
  const handleTrackSelect = (track, tracks = []) => {
    setCurrentTrack(track);
    // Add remaining tracks to queue
    const trackIndex = tracks.findIndex(t => t.id === track.id);
    setQueue(tracks.slice(trackIndex + 1));
    setIsPlaying(true);
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0) {
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
  }, [queue, repeat]);

  // Handle track changes
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  // Handle volume changes
  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = shuffle
        ? queue[Math.floor(Math.random() * queue.length)]
        : queue[0];
      setCurrentTrack(nextTrack);
      setQueue(prev => prev.filter(track => track.id !== nextTrack.id));
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    // Implement previous track logic if needed
    audioRef.current.currentTime = 0;
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const value = {
    currentTrack,
    setCurrentTrack,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    repeat,
    toggleRepeat: () => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none'),
    shuffle,
    toggleShuffle: () => setShuffle(!shuffle),
    playNext,
    playPrevious,
    queue,
    setQueue,
    currentTime,
    duration,
    seekTo,
    handleTrackSelect
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};