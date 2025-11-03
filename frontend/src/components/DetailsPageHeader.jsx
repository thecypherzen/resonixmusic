import { FaPlay, FaPause, FaHeart, FaDownload } from "react-icons/fa";
import UsePlayer from "../hooks/UsePlayer";
import UseDownload from "../hooks/UseDownload";
import { useEffect } from "react";
import { Spinner } from "./ui/spinner";
import { AlertCircle, Share2 } from "lucide-react";
import { capitalise } from "@/lib/utils";
import { UseThumbnail } from "@/hooks/UseThumbnail";
import { useTheme } from "@/hooks/useTheme";
import { UseAppState } from "@/hooks/UseAppState";

export function DetailsPageHeader({ type, dataSet }) {
  const { downloadZip, error, isLoading: isDownloading } = UseDownload();
  const { isPlaying } = UsePlayer();
  const fallbackThumbnail = UseThumbnail(type, dataSet.id);
  const { selectedPlaylist } = UseAppState();
  const { theme } = useTheme();
  useEffect(() => {
    console.log(
      "-----> fallbackThumbnail:",
      fallbackThumbnail,
      "\ndAtaset ID:",
      dataSet.id,
      "selectedPlaylist Id:",
      selectedPlaylist?.id
    );
  }, [error, isDownloading, dataSet.id, selectedPlaylist]);
  return (
    <>
      {/* Banner */}
      <div
        className="flex items-end gap-6 p-6 h-[20rem] relative z-0"
        data-theme={theme}
      >
        <div
          className="absolute inset-0 w-full h-full opacity-80 -z-10"
          style={{
            backgroundImage: `url(${fallbackThumbnail})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
          data-theme={theme}
        ></div>
        <div
          className="absolute inset-0 w-full h-full -z-9 backdrop-blur-[0.5px] bg-gradient-to-t from-background from-20% to-transparent to-200% bg-blend-color-burn"
          data-theme={theme}
        ></div>
        <img
          src={dataSet.thumbnail ? dataSet.thumbnail : fallbackThumbnail}
          alt={dataSet.title || "Playlist Thumbnail"}
          className="w-[10.75rem] h-[10.75rem] shadow-2xl rounded-lg"
        />
        <div className="flex flex-col gap-3">
          <span className="text-md font-bold">{capitalise(type)}</span>
          <h1 className="text-[5rem] font-bold leading-tight truncate max-w-full overflow-hidden whitespace-nowrap">
            {capitalise(dataSet.title)}
          </h1>
          <div className="flex items-center gap-2 text-md">
            <img
              src={dataSet.thumbnail ? dataSet.thumbnail : fallbackThumbnail}
              alt={dataSet.title}
              className="w-6 h-6 rounded-full"
            />
            <span className="font-bold hover:underline cursor-pointer">
              {dataSet.user_name}
            </span>
            <span className="text-neutral-400">
              {new Date(dataSet.creationDate).getFullYear()}
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
