import TopNav from "../components/TopNav";
import BottomPlayer from "../components/BottomPlayer";
import PlayerHome from "../components/PlayerHome";
import { useTheme } from "../hooks/useTheme";

const MusicPlayer = () => {
  const { theme } = useTheme();
  return (
    <div
      className="w-full min-h-screen border-2 border-yellow-200 bg-red-500"
      data-theme={theme}
    >
      <h1>Music Player</h1>
      {/*<TopNav />
      <div className="border-2 border-purple-400">
        <PlayerHome />
      </div>
      <BottomPlayer />*/}
    </div>
  );
};

export default MusicPlayer;
