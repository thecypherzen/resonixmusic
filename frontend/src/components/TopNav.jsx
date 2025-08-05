import React, { useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import MobileNavigation from "./navs/MobileNavigation";
import { useIsMedia } from "../hooks/useIsMobile";

function TopNav() {
  const isMobileBreakpoint = useIsMedia(767);
  useEffect(() => {}, [isMobileBreakpoint]);

  return (
    <div className="flex flex-row w-full bg-transparent items-center py-10 px-5 md:px-10 lg:px-16 h-[4.375rem] mx-auto sticky top-0 z-500 bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 gap-4">
      {isMobileBreakpoint && <MobileNavigation />}
      {/* Searchbar */}
      <div className="w-full lg:w-3/4 flex bg-neutral-800 h-[2.5rem] rounded-lg sm:rounded-xl border border-neutral-600 my-4 items-center p-4 transition-all duration-400 md:hover:w-full shadow-2xl">
        <LuSearch className="w-4 h-4" />
        <input
          type="search"
          name="searchbar"
          id="searchbar"
          placeholder="Search"
          className="bg-transparent w-full focus:outline-none p-2 placeholder:text-sm"
        />
      </div>
    </div>
  );
}

export default TopNav;
