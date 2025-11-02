import { createContext, useContext } from "react";

const PlayerContext = createContext({
  currentTrack: null,
  isPlaying: false,
  volume: null,
  isLoading: false,
  error: null,
  loopStyle: null, // "all", "one", "none"
  playOrder: "normal", // "normal", "shuffle",
  autoPlay: false,
  queue: [],
  tracksPool: [],
  setAutoPlay: () => {},
  setPlayOrder: () => {},
  setVoume: () => {},
  setLoopStyle: () => {},
  setIsLoading: () => {},
  setCurrentTrack: () => {},
  loadTracksPool: () => {},
  handleTrackSelect: () => {},
  playNext: () => {},
  playPrevious: () => {},
  togglePlayPause: () => {},
  loadNewQueue: () => {},
  addToQueue: () => {},
  removeFromQueue: () => {},
  clearQueue: () => {},
  loadNewPlayer: () => {},
});

const PlayerProvider = ({ children }) => {
  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

const UsePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("UsePlayer must be used within a PlayerProvider");
  }
  return context;
};

export { PlayerContext, PlayerProvider, UsePlayer };
export default UsePlayer;
