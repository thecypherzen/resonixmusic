import React from "react";
import { FaPlay } from "react-icons/fa";
import { usePlaylistThumbnail } from "../hooks/usePlaylistThumbnail";
import MusicCard from "./MusicCard";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../lib/utils";

const PlaylistCard = ({ playlist, onClick }) => {
  const thumbnail = usePlaylistThumbnail(playlist.id);
  const { theme } = useTheme();
  return (
    <button
      onClick={() => onClick(playlist)}
      className={cn(
        "flex flex-col bg-opacity-[2%] rounded-xl h-full gap-4 hover:border-none transition-all relative group hover:bg-opacity-5",
        theme === "dark"
          ? "bg-neutral-400/10"
          : "bg-gradient-to-b from-neutral-800 to-neutral-900"
      )}
      data-theme={theme}
    >
      <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 flex bg-white size-10 rounded-full shadow-2xl absolute right-6 top-[7.5rem] hover:scale-110 active:scale-110 transition-all duration-300">
        <FaPlay className="m-auto shadow-lg fill-black" />
      </div>
      <MusicCard
        variant="boxed"
        imageUrl={thumbnail}
        className="w-[160px]  md:w-[200px]"
      >
        <p className="font-bold text-md w-full truncate text-ellipsis dark:text-neutral-100/90 text-neutral-900">
          {playlist.title}
        </p>
        <p className="font-normal text-[0.75rem] text-neutral-200/70 w-95/100 truncate text-ellipsis">
          {playlist.artist}
        </p>
      </MusicCard>
    </button>
  );
};

export default PlaylistCard;
