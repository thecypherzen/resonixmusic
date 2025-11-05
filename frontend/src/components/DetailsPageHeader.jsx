import { FaPlay, FaPause, FaHeart, FaDownload } from "react-icons/fa";
import UsePlayer from "../hooks/UsePlayer";
import UseDownload from "../hooks/UseDownload";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { AlertCircle, Share2 } from "lucide-react";
import { capitalise } from "@/lib/utils";
import { UseRandomImages } from "@/hooks/UseRandomImages";
import { useTheme } from "@/hooks/useTheme";
import { UseAppState } from "@/hooks/UseAppState";

export function DetailsPageHeader({ type, dataSet }) {
  const { downloadZip, error, isLoading: isDownloading } = UseDownload();
  const { isPlaying } = UsePlayer();
  const bgImageUrl = UseRandomImages(type, dataSet.id);
  const { selectedPlaylist } = UseAppState();
  const { theme } = useTheme();
  console.log("dataset:", dataSet, "type:", type);
  const getArtistThumbnail = async () => {};
  useEffect(() => {}, [
    error,
    isDownloading,
    dataSet.id,
    selectedPlaylist,
    bgImageUrl,
  ]);
  return (
    <>
      <div
        className="flex items-end gap-6 p-6 h-[20rem] relative z-0"
        data-theme={theme}
      >
        {/* Banner */}
        <div
          className="absolute inset-0 w-full h-full opacity-80 -z-10 "
          style={{
            backgroundImage: dataSet.thumbnail
              ? dataSet.thumbnail
              : bgImageUrl?.startsWith("/")
              ? `url(${bgImageUrl})`
              : `url(${bgImageUrl}&w=800&dpr=2)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          data-theme={theme}
        ></div>
        {/* Bg overlay */}
        <div
          className="absolute inset-0 w-full h-full -z-9 backdrop-blur-[0.5px] bg-gradient-to-t from-background from-20% to-transparent to-200% bg-blend-color-burn"
          data-theme={theme}
        ></div>
        {/* Main Item Image */}
        <div
          className="w-[10.75rem] h-[10.75rem] shadow-2xl rounded-lg"
          style={{
            backgroundImage: dataSet.thumbnail
              ? dataSet.thumbnail
              : bgImageUrl?.startsWith("/")
              ? `url(${bgImageUrl})`
              : `url(${bgImageUrl}&w=300&dpr=2)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          data-theme={theme}
        ></div>
        <div className="flex flex-col gap-3">
          <span className="text-md font-bold">{capitalise(type)}</span>
          <h1 className="text-[5rem] font-bold leading-tight truncate max-w-full overflow-hidden whitespace-nowrap">
            {capitalise(dataSet.title)}
          </h1>
          <div className="flex items-center gap-2 text-md">
            <span>By</span>
            <span className="font-bold hover:underline cursor-pointer">
              {dataSet.artist}
            </span>
            <span className="text-neutral-400">
              •&nbsp; {new Date(dataSet.creationDate).getFullYear()}
            </span>
            {dataSet && dataSet.tracks && (
              <span className="text-neutral-400">
                • {dataSet.tracks.length} songs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 p-6">
        <button
          onClick={() => {}}
          className="font-medium flex items-center justify-center bg-[#08B2F0] hover:scale-[1.05] rounded-full transition-all duration-300 text-md px-10 py-3 gap-2 text-foreground dark:text-background"
          disabled={!dataSet.length}
        >
          {isPlaying ? (
            <>
              <FaPause /> Pause
            </>
          ) : (
            <>
              <FaPlay /> Play all
            </>
          )}
        </button>
        <button
          className="bg-transparent text-foreground"
          onClick={() => {
            console.log("like", type);
          }}
        >
          <FaHeart size={24} className="hover:fill-red-500" />
        </button>
        <button
          onClick={() => downloadZip(dataSet, dataSet.name)}
          className="bg-transparent text-foreground hover:text-[#08B2F0] transition-colors flex items-center gap-2"
        >
          <FaDownload size={24} />{" "}
          {isDownloading && (
            <Spinner
              onClick={() => {
                console.log("download", type);
              }}
            />
          )}
        </button>
      </div>
    </>
  );
}
