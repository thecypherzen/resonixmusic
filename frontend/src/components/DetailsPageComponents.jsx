import { BsCollectionPlay } from "react-icons/bs";
import UsePlayer from "../hooks/UsePlayer";
import UseDownload from "../hooks/UseDownload";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { AlertCircle, Share2 } from "lucide-react";

export function DetailsPageHeader({ type, dataSet }) {
  return (
    <div className="flex items-end gap-6 p-6 h-[20rem] bg-transparent">
      <img
        src={dataSet.thumbnail ? dataSet.thumbnail : "/default_playlist.png"}
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
            src={dataSet.thumbnail}
            alt={dataSet.user_name}
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
  );
}

// type := playlist | track | album
export function DetailsPageControls({ collection, type }) {
  const { downloadZip, error, isLoading: isDownloading } = UseDownload();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {}, [error, isDownloading]);

  return (
    <div className="flex items-center gap-8 p-6">
      <button
        onClick={() => {}}
        className="w-42 h-12 flex items-center justify-center bg-[#08B2F0] hover:bg-opacity-80 rounded-full transition-all duration-300 text-black text-sm px-10 gap-2"
        disabled={!collection.length}
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
        className="bg-transparent text-white"
        onClick={() => {
          console.log("like", type);
        }}
      >
        <FaHeart size={24} className="hover:fill-red-500" />
      </button>
      <button
        onClick={() => downloadZip(collection, collection.name)}
        className="bg-transparent text-white hover:text-[#08B2F0] transition-colors flex items-center gap-2"
      >
        <FaDownload size={24} /> {isDownloading && <Spinner />}
      </button>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => {
            setShowMoreMenu((prev) => !prev);
          }}
          className="bg-transparent hover:bg-white/10 p-2 rounded-full"
        >
          <FaEllipsisH size={24} />
        </button>
        {showMenu && (
          <div className="absolute left-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-xl border border-neutral-600 z-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(false);
              }}
              className="bg-transparent w-full text-left px-4 py-3 hover:bg-white/10 rounded-none space-x-5"
            >
              Share <Share2 />
            </button>
          </div>
        )}
        {error && (
          <span className="inline-flex items-center">
            <AlertCircle /> <span>{error.message}</span>
          </span>
        )}
      </div>
    </div>
  );
}
