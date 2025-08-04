import SideBar from "@/components/SideBar";
import { useTheme } from "@/hooks/useTheme";
import { Outlet } from "react-router-dom";

/**
 * @component
 * @name MusicPlayerLayout
 * @description A layout component for the music player that includes
 * a sidebar and an outlet for nested routes. It applies the current
 * theme to the layout.
 * @returns {JSX.Element} The rendered music player layout component.
 */
const MusicPlayerLayout = () => {
  const { theme } = useTheme();
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_3fr] w-full h-screen dark:bg-[#121212] neutral-900 dark:text-neutral-200"
      data-theme={theme}
    >
      <SideBar />
      <Outlet />
    </div>
  );
};

export default MusicPlayerLayout;
