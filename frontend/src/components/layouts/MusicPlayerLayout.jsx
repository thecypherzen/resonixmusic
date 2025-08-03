import SideBar from "@/components/SideBar";
import { useTheme } from "@/hooks/useTheme";
import { Outlet } from "react-router-dom";

const MusicPlayerLayout = () => {
  const { theme } = useTheme();
  return (
    <div
      className="grid grid-cols-[1fr_3fr] w-full h-screen border-3 border-red-900 overflow-y-auto"
      data-theme={theme}
    >
      <SideBar />
      <Outlet />
    </div>
  );
};

export default MusicPlayerLayout;
