import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CURRENT_DATE = '2025-01-23 18:08:02';
const CURRENT_USER = 'gabrielisaacs';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(50);
  const [repeat, setRepeat] = useState('none');
  const [shuffle, setShuffle] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const handleTrackSelect = async (track, tracks = []) => {
    try {
      setIsLoading(true);

      if (!track?.url && !track?.stream_url) {
        throw new Error('No playable URL found for this track');
      }

      const audioUrl = track.stream_url || track.url;

      // Test if the URL is accessible
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('Audio source is not accessible');
      }

      // Update current track and queue
      setCurrentTrack({
        ...track,
        url: audioUrl
      });

      const trackIndex = tracks.findIndex(t => t.id === track.id);
      setQueue(tracks.slice(trackIndex + 1));

      // Reset error state
      setError(null);

      // Update audio source and play
      const audio = audioRef.current;
      audio.src = audioUrl;
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


  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setError(null);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Replay failed:', error);
          setError('Failed to replay track');
        });
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

      // Provide more detailed error messages
      let errorMessage = 'An error occurred while playing the track';
      if (audio.error) {
        switch (audio.error.code) {
          case 1:
            errorMessage = 'The audio file cannot be fetched';
            break;
          case 2:
            errorMessage = 'Network error occurred while loading the audio';
            break;
          case 3:
            errorMessage = 'Error decoding the audio file';
            break;
          case 4:
            errorMessage = 'Audio source not supported';
            break;
        }
      }
      setError(errorMessage);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('abort', () => setError('Audio playback was aborted'));
    audio.addEventListener('stalled', () => setError('Audio playback stalled'));

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('abort', () => setError('Audio playback was aborted'));
      audio.removeEventListener('stalled', () => setError('Audio playback stalled'));
    };
  }, [queue, repeat, currentTrack]);

  // Volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
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

  const value = {
    currentTrack,
    isPlaying,
    isLoading,
    volume,
    repeat,
    shuffle,
    queue,
    currentTime,
    error,
    duration,
    togglePlay,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    playNext,
    playPrevious,
    seekTo,
    handleTrackSelect,
    setError
  }

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

export default PlayerContext;