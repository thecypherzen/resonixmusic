import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none'); // 'none', 'all', 'one'
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  const handleTrackSelect = (track, tracks = []) => {
    console.log('Received track:', track); // Debug log

    if (!track?.url) {
      console.error('Track URL is missing:', track);
      return;
    }

    try {
      // Validate URL
      new URL(track.url);

      setCurrentTrack(track);
      const trackIndex = tracks.findIndex(t => t.id === track.id);
      setQueue(tracks.slice(trackIndex + 1));

      // Reset audio and start playing
      audioRef.current.src = track.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
    } catch (error) {
      console.error('Invalid track URL:', track.url);
      setIsPlaying(false);
    }
  };

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
        audio.play().catch(console.error);
      } else if (queue.length > 0) {
        playNext();
      } else if (repeat === 'all' && currentTrack) {
        handleTrackSelect(currentTrack, [currentTrack, ...queue]);
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
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
  }, [queue, repeat, currentTrack]);

  useEffect(() => {
    // Initialize audio element with default properties
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.preload = "metadata";

    return () => {
      // Cleanup
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    const nextTrack = shuffle
      ? queue[Math.floor(Math.random() * queue.length)]
      : queue[0];

    handleTrackSelect(nextTrack, queue);
  };

  const playPrevious = () => {
    if (currentTime > 3) {
      // If current time is more than 3 seconds, restart the current track
      audioRef.current.currentTime = 0;
    } else if (currentTrack) {
      // Otherwise, implement previous track logic here
      // For now, just restart the current track
      audioRef.current.currentTime = 0;
    }
  };

  const seekTo = (time) => {
    if (!audioRef.current) return;

    const newTime = Math.min(Math.max(0, time), duration);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleRepeat = () => {
    setRepeat(current => {
      switch (current) {
        case 'none': return 'all';
        case 'all': return 'one';
        default: return 'none';
      }
    });
  };

  const toggleShuffle = () => {
    setShuffle(current => !current);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        repeat,
        shuffle,
        queue,
        currentTime,
        duration,
        togglePlay,
        setVolume,
        toggleRepeat,
        toggleShuffle,
        playNext,
        playPrevious,
        seekTo,
        handleTrackSelect
      }}
    >
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