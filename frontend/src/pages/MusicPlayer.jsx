import TopNav from "../components/TopNav";
import BottomPlayer from "../components/BottomPlayer";
import HomePage from "./HomePage";
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
  return <div className="flex flex-col " data-theme={theme}></div>;
};

export default MusicPlayer;
