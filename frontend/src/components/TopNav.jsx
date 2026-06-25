import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { LuSearch } from "react-icons/lu";
import MobileNavigation from "./navs/MobileNavigation";
import { useIsMedia } from "../hooks/useIsMobile";
import { ArrowLeft } from "lucide-react";

function TopNav() {
  const isMobileBreakpoint = useIsMedia(767);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {}, [isMobileBreakpoint]);

  return (
    <div className="flex flex-row w-full bg-transparent items-center py-10 px-5 md:px-8 lg:px-12 max-h-[3.5rem] mx-auto sticky top-0 z-500 bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-20 gap-4">
      {isMobileBreakpoint && <MobileNavigation />}
      {pathname !== "/" && (
        <div
          className="p-[5.5px] rounded-full border border-neutral-500 text-neutral-500 hover:text-white active:text-white hover:border-white active:border-white transition-colors duration-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-inherit font-bold" size="20px" />
        </div>
      )}
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
