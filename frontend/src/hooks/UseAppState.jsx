import { createContext, useState, useContext, useEffect } from "react";

const AppStateContext = createContext({
  playlists: null,
  tracks: null,
  error: null,
  selectedPlaylist: null,
  selectedTracks: null,
  setPlaylists: null,
  setTracks: null,
  setError: null,
  setSelectedPlaylist: null,
  setSelectedTracks: null,
  thumbnailStore: null,
});

export function AppStateProvider({ children }) {
  const [playlists, setPlaylists] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState(null);
  const thumbnailStore = new Map();

  useEffect(() => {
    console.log('AppState Updated:', {
      selectedPlaylist,
      selectedTracks,
      error
    });
  }, [selectedPlaylist, selectedTracks, error]);

  return (
    <AppStateContext.Provider
      value={{
        playlists,
        tracks,
        error,
        selectedPlaylist,
        selectedTracks,
        setPlaylists,
        setTracks,
        setError,
        setSelectedPlaylist,
        setSelectedTracks,
        thumbnailStore,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function UseAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("UseAppState must be used within an AppStateProvider");
  }
  return context;
}
