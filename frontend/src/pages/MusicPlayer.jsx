import TopNav from "../components/TopNav";
import BottomPlayer from "../components/BottomPlayer";
import PlayerHome from "../components/PlayerHome";
import { useTheme } from "../hooks/useTheme";

/**
 * @component
 * @name MusicPlayer
 * @description The main component that renders the music player interface
 * Sets the current theme for children components to inherit from
 * where applicable
 * @returns {React.ReactNode} The Music Player Component
 */
const MusicPlayer = () => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col h-screen overflow-y-auto" data-theme={theme}>
      <TopNav />
      <div className="h-full">
        <PlayerHome />
      </div>
      <BottomPlayer />
    </div>
  );
};

export default MusicPlayer;
