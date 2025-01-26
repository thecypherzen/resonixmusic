import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none');
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playHistory, setPlayHistory] = useState([]);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.preload = "metadata";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const addToHistory = (track) => {
    if (!track) return;
    setPlayHistory(prev => {
      const newHistory = [track, ...prev].slice(0, 50);
      return Array.from(new Set(newHistory.map(t => t.id)))
        .map(id => newHistory.find(t => t.id === id));
    });
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTrackSelect = async (track, tracks = [], addToQueue = true) => {
    try {
      setIsLoading(true);

      if (!track?.url && !track?.stream_url) {
        throw new Error('No playable URL found for this track');
      }

      const audioUrl = track.stream_url || track.url;
      const response = await fetch(audioUrl, { method: 'HEAD' });

      if (!response.ok) {
        throw new Error('Audio source is not accessible');
      }

      if (currentTrack) {
        addToHistory(currentTrack);
      }

      setCurrentTrack({ ...track, url: audioUrl });

      const audio = audioRef.current;
      audio.src = audioUrl;

      if (addToQueue) {
        const trackIndex = tracks.findIndex(t => t.id === track.id);
        setCurrentIndex(trackIndex);
        setOriginalQueue(tracks);
        setQueue(tracks.slice(trackIndex + 1)); // Correctly sets the queue
      }
      setError(null);

      audio.load();

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (playError) {
        console.error('Playback failed:', playError);
        setIsPlaying(false);
        setError('Failed to play track. Please try again.');
      }
    } catch (error) {
      console.error('Track selection failed:', error);
      setError(error.message);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return; // Prevent errors if audioRef.current is null

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (queue.length > 0) {
        playNext();
      } else if (repeat === 'all' && originalQueue.length > 0) {
        handleTrackSelect(originalQueue[0], originalQueue);
      } else {
        setIsPlaying(false);
      }
    };
    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      setError('An error occurred while playing the track');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [queue, repeat, originalQueue, handleTrackSelect]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!currentTrack) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack || originalQueue.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= originalQueue.length) {
      nextIndex = repeat === 'all' ? 0 : -1; // Loop if repeat all is on
    }

    if (nextIndex !== -1) {
      handleTrackSelect(originalQueue[nextIndex], originalQueue);
    } else {
      setIsPlaying(false); // Stop playing if no next track and not repeating
    }
  };

  const playPrevious = () => {
    if (!currentTrack || originalQueue.length === 0) return;

    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeat === 'all' ? originalQueue.length - 1 : -1;
    }

    if (prevIndex !== -1) {
      handleTrackSelect(originalQueue[prevIndex], originalQueue);
    }
  };


  const seekTo = (time) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const toggleRepeat = () => {
    setRepeat(current => current === 'none' ? 'all' : current === 'all' ? 'one' : 'none');
  };

  const toggleShuffle = () => setShuffle(!shuffle);

  const value = {
    currentTrack, isPlaying, isLoading, volume, repeat, shuffle, queue,
    currentTime, error, duration, playHistory, originalQueue, currentIndex,
    togglePlay, setVolume, toggleRepeat, toggleShuffle, playNext, playPrevious, seekTo,
    handleTrackSelect, setError
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};

export default PlayerContext;