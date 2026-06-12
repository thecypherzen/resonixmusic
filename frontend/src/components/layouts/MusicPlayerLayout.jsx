import { useTheme } from "@/hooks/useTheme";
import { Outlet } from "react-router-dom";
import TopNav from "../TopNav";

/**
 * @component
 * @name MusicPlayerLayout
 * @description A layout component for the music player area
 * that is the section that excludes the sidebar.
 * It includes a top nav and an outlet for nested routes.
 * It applies the current theme to the layout.
 * @returns {JSX.Element} The rendered music player layout component.
 */
const MusicPlayerLayout = () => {
  const { theme } = useTheme();
  return (
    <>
      <div
        className="grid bg-background w-full h-full overflow-y-scroll overflow-x-hidden"
        data-theme={theme}
      >
        <TopNav />
        <Outlet />
      </div>
    </>
  );
};

export default MusicPlayerLayout;
