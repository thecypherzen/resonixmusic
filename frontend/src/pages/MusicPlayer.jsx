import TopNav from "../components/TopNav";
import BottomPlayer from "../components/BottomPlayer";
import PlayerHome from "../components/PlayerHome";
import { useTheme } from "../hooks/useTheme";

const MusicPlayer = () => {
  const { theme } = useTheme();
  return (
    <div className="border-3 border-red-500 flex flex-col " data-theme={theme}>
      <TopNav />
      <div className="h-full border-2 border-purple-400">
        <PlayerHome />
      </div>
      <BottomPlayer />
    </div>
  );
};

export default MusicPlayer;
