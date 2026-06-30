import { useState } from "react";
import { useIsMedia } from "@/hooks/useIsMobile";
import UsePlayer from "@/hooks/UsePlayer";
import { cn, formatDuration } from "@/lib/utils";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  FaPlay,
  FaPause,
  FaDownload,
  FaThumbsUp,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown,
  FaShare,
} from "react-icons/fa";

export default function TracksList({ tracks = null }) {
  const [activeTrack, setActiveTrack] = useState("");
  const isMd = useIsMedia(768);
  const { isPlaying, currentTrack, isLoading } = UsePlayer();
  const toggleTrackSelection = (p) => {
    if (activeTrack && activeTrack === p) {
      setActiveTrack("");
      return;
    }
    setActiveTrack(p);
  };
  if (!tracks || tracks.length === 0) {
    return <p className="text-center">No tracks available.</p>;
  }
  return (
    <section className="px-6 pt-10 pb-36 w-full h-full">
      {tracks.map((track, index) => {
        return (
          <div
            key={`track-${track.id}`}
            id={track.id}
            className={cn(
              "group hover:bg-neutral-700/50 rounded-lg transition-colors flex gap-2 py-2 px-3 [&:not(last-child)]:mb-2",
              activeTrack === track.id && "border bg-neutral-700/50",
            )}
            onClick={() => toggleTrackSelection(track.id)}
          >
            {/* Serial Number, Play/pause btn */}
            <div className="place-content-center place-items-center w-7 ">
              <>
                <span
                  className={cn(
                    "group-hover:hidden",
                    activeTrack === track.id && "hidden",
                  )}
                >
                  {index + 1}
                </span>
                {isPlaying && currentTrack?.id === track.id ? (
                  <FaPause className="text-[#08B2F0]" />
                ) : (
                  <FaPlay
                    className={cn(
                      "hidden group-hover:inline-block text-white",
                      activeTrack === track.id && "inline-block",
                    )}
                  />
                )}
              </>
            </div>
            {/* Track Title */}
            <div className="flex items-center justify-start gap-3 mr-auto max-w-3/5">
              <div className="flex flex-col">
                <p
                  className={`font-normal line-clamp-1 text-ellipsis ${
                    currentTrack?.id === track.id ? "text-highlight" : ""
                  }`}
                >
                  {track.title}
                </p>
                <div className="text-sm text-neutral-400">{track.artist}</div>
              </div>
            </div>
            {/* Like and dislike buttons */}
            <div className="flex items-center justify-start gap-2 ml-auto">
              <div className="size-6 relative group/likeBtn">
                <FaRegThumbsUp
                  size="20"
                  className={cn(
                    "absolute inset-0 z-5 group-hover/likeBtn:opacity-0 transition-opacity duration-200 fill-text-neutral-300 text-neutral-300",
                    activeTrack === track.id &&
                      "group-active/likeBtn:opacity-0",
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
                <FaThumbsUp
                  size="19"
                  className={cn(
                    "absolute inset-0 z-4 opacity-0 group-hover/likeBtn:opacity-100 transition-opacity duration-200 text-neutral-300 fill-neutral-300",
                    activeTrack === track.id &&
                      "group-active/likeBtn:opacity-100",
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="size-6 relative group/likeBtn">
                <FaRegThumbsDown
                  size="20"
                  className={cn(
                    "absolute inset-0 z-5 group-hover/likeBtn:opacity-0 transition-opacity duration-200 fill-text-neutral-300 text-neutral-300",
                    activeTrack === track.id &&
                      "group-active/likeBtn:opacity-0",
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
                <FaThumbsDown
                  size="19"
                  className={cn(
                    "absolute inset-0 z-4 opacity-0 group-hover/likeBtn:opacity-100 transition-opacity duration-200 text-neutral-300 fill-neutral-300",
                    activeTrack === track.id &&
                      "group-active/likeBtn:opacity-100",
                  )}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            {/* Track likes count and Download btns */}
            <div className="px-4 py-3 text-neutral-400 hidden lg:flex lg:gap-1 lg:items-center">
              <span>{track.likes || 0}</span>
              <FaThumbsUp size="14" className="mb-[4px]" />
            </div>
            <div className="px-4 py-3 text-center hidden md:block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTrack(track);
                }}
                className="bg-transparent text-neutral-400 hover:text-[#08B2F0] transition-colors"
              >
                <FaDownload size={16} />
              </button>
            </div>
            {/* Track Duration + sub menu btn */}
            <div className="w-7 text-right text-neutral-400 h-full mt-auto mb-auto">
              <span
                className={cn(
                  "group-hover:hidden",
                  activeTrack === track.id && "hidden",
                )}
              >
                {formatDuration(track.duration)}
              </span>
              <button
                popovertarget={`track-${track.id}-menu`}
                className={cn(
                  "tracks-context-menu-trigger hidden group-hover:inline-block hover:bg-background rounded-full p-2",
                  activeTrack === track.id &&
                    "inline-block active:bg-background",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ anchorName: `--track-${track.id}-menu` }}
              >
                <EllipsisVerticalIcon size="20px" />
              </button>
            </div>
            <div
              id={`track-${track.id}-menu`}
              style={{
                positionAnchor: `--track-${track.id}-menu`,
              }}
              className="bg-neutral-900 m-0 inset-auto absolute top-[anchor(top)] right-[anchor(left)] rounded-md border border-foreground/20 text-foreground min-h-16 content-center"
              popover="auto"
            >
              <span className="py-2 px-5 hover:bg-neutral-700 flex gap-2">
                <FaShare size="16" />
                Share
              </span>
              {isMd && (
                <span className="py-2 px-5 hover:bg-neutral-700 flex gap-2">
                  <FaDownload size="16" />
                  Download
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
