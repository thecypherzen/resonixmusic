import { FaPlay, FaPause, FaHeart, FaDownload } from "react-icons/fa";
import UsePlayer from "../hooks/UsePlayer";
import UseDownload from "../hooks/UseDownload";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { AlertCircle, Share2 } from "lucide-react";
import { capitalise } from "@/lib/utils";
import { UseRandomImages } from "@/hooks/UseRandomImages";
import { useTheme } from "@/hooks/useTheme";
import { useIsMedia } from "@/hooks/useIsMobile";

/**
 * Todo:
 * - Fetch dataset owner's thumbnail and set ownerThumbnail
 * with it.
 */
export function DetailsPageHeader({ type, dataSet, tracksCount, namespace }) {
  const [ownerThumbnail, setOwnerThumbnail] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const { downloadZip, isLoading: isDownloading } = UseDownload();
  const { isPlaying } = UsePlayer();
  const isMd = useIsMedia(768);
  const { fetchRandomImage, imageIterator } = UseRandomImages(
    namespace,
    dataSet?.id,
  );
  const { theme } = useTheme();
  useEffect(() => {
    if (imageIterator && fetchRandomImage) {
      setOwnerThumbnail(
        fetchRandomImage(`${namespace}-owner`, dataSet?.id ?? 1),
      );
      setBgImage(fetchRandomImage(namespace, dataSet?.id ?? 1));
    }
  }, [imageIterator, fetchRandomImage, type, namespace, dataSet, dataSet?.id]);

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
              ? `url(${dataSet.thumbnail})`
              : bgImage?.startsWith("/")
                ? `url(${bgImage})`
                : `url(${bgImage}&w=800&dpr=2)`,
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
        {!isMd && (
          <div
            className="size-[10.85rem] shadow-2xl rounded-lg"
            style={{
              backgroundImage: ownerThumbnail?.startsWith("/")
                ? `url(${ownerThumbnail})`
                : `url(${ownerThumbnail}&w=300&dpr=2)`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
            data-theme={theme}
          ></div>
        )}
        <div className="flex flex-col gap-3">
          <span className="text-md font-normal tracking-wide text-neutral-400">
            {capitalise(type)}
          </span>
          <h1 className="text-[5rem] font-bold leading-tight truncate max-w-full overflow-hidden whitespace-nowrap">
            {capitalise(dataSet.title)}
          </h1>
          {/* Element Info */}
          <div className="flex items-center gap-2 text-md">
            <div
              className="w-8 aspect-square rounded-full"
              style={{
                backgroundImage: dataSet.ownerThumbnail
                  ? `url(${dataSet.ownerThumbnail})`
                  : ownerThumbnail?.startsWith("/")
                    ? `url(${ownerThumbnail})`
                    : `url(${ownerThumbnail}&w=300&dpr=2)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
              }}
            ></div>
            <span className="font-bold">
              {type === "playlist" ? dataSet.userName : dataSet.artist}
            </span>
            <span className="text-neutral-400">
              •&nbsp; {new Date(dataSet.releaseDate).getFullYear()}
            </span>
            <span className="text-neutral-400">• {tracksCount} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 p-6">
        <button
          onClick={() => {}}
          className="font-medium flex items-center justify-center bg-highlight hover:scale-[1.05] hover:bg-highlight-dark active:scale-[1.05] active:bg-highlight-dark rounded-full transition-all duration-300 text-sm md:text-md px-5 md:px-10 py-3 gap-2 text-foreground dark:text-background"
          disabled={!dataSet.length || !tracksCount}
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
