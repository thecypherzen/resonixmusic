import { createContext, useState, useContext, useEffect } from "react";

const imagesStore = new Map();

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
  imagesStore: null,
});

export function AppStateProvider({ children }) {
  const [playlists, setPlaylists] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [trendingTracks, setTrendingTracks] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState(null);

  useEffect(() => {
    console.log("AppState Updated:", {
      selectedPlaylist,
      selectedTracks,
      error,
    });
  }, [selectedPlaylist, selectedTracks, error]);

  return (
    <AppStateContext.Provider
      value={{
        albums,
        playlists,
        tracks,
        error,
        selectedAlbum,
        selectedPlaylist,
        selectedTracks,
        trendingTracks,
        setAlbums,
        setPlaylists,
        setTracks,
        setError,
        setSelectedAlbum,
        setSelectedPlaylist,
        setSelectedTracks,
        setTrendingTracks,
        imagesStore,
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
