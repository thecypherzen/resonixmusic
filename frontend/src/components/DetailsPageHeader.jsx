import { FaPlay, FaPause, FaHeart, FaDownload } from "react-icons/fa";
import UsePlayer from "../hooks/UsePlayer";
import UseDownload from "../hooks/UseDownload";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";
import { UseRandomImages } from "@/hooks/UseRandomImages";
import { useTheme } from "@/hooks/useTheme";
import { useIsMedia } from "@/hooks/useIsMobile";

/**
 * Todo:
 * - Fetch dataset owner's thumbnail and set ownerThumbnail
 * with it.
 */
export function DetailsPageHeader({
  type,
  dataSet,
  tracksCount,
  namespace,
  hasOwner = true,
}) {
  const [ownerThumbnail, setOwnerThumbnail] = useState(null);
  const [bgImage, setBgImage] = useState(null);
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
    <header className="relative h-[25rem] px-10 py-6">
      <DetailsBackdrop data={dataSet} theme={theme} bgImage={bgImage} />
      <div
        className="relative z-20 h-full flex flex-col gap-4 items-start justify-end"
        data-theme={theme}
      >
        <DetailsItemType
          value={type}
          className="mb-auto bg-neutral-900/80 text-neutral-300 backdrop-blur-sm rounded-full px-3 py-1 cursor-default border capitalize"
        />
        <div className="flex items-center gap-6">
          {hasOwner && !!!isMd && (
            <DetailsItemMainImage image={ownerThumbnail} theme={theme} />
          )}
          <div className="space-y-3">
            <DetailsItemTitle title={dataSet.title} className="capitalize" />
            {/* Element Info */}
            <DetailsFooter className="flex flex-wrap space-y-2 gap-x-5">
              <DetailsItemOwner
                data={dataSet}
                fallbackImg={ownerThumbnail}
                type={type}
                className="mr-auto max-w-4/5"
              />
              <div className="whitespace-nowrap space-x-5">
                <span className="text-neutral-400">
                  •&nbsp; {new Date(dataSet.releaseDate).getFullYear()}
                </span>
                {tracksCount && (
                  <span className="text-neutral-400">
                    • {tracksCount} songs
                  </span>
                )}
              </div>
            </DetailsFooter>
          </div>
        </div>
        {/* Controls */}
        <div className="w-full z-21 flex items-center gap-8 pt-3 ">
          <DetailsPlayBtn disabled={!dataSet?.length || !tracksCount} />
          <DetailsLikeBtn />
          <DetailsDownloadBtn data={dataSet} />
        </div>
      </div>
    </header>
  );
}

export const DetailsMainContnet = ({ children }) => {
  return <main>{children}</main>;
};

export const DetailsItemTitle = ({ title, className }) => {
  return (
    <h2
      className={cn(
        "text-4xl md:text-5xl font-bold leading-tight truncate overflow-hidden whitespace-pre-wrap",
        className,
      )}
    >
      {title}
    </h2>
  );
};

export const DetailsItemType = ({ value, className }) => {
  return (
    <span
      className={cn(
        "text-sm font-medium tracking-wide text-neutral-50",
        className,
      )}
    >
      {value}
    </span>
  );
};

export const DetailsPlayBtn = ({ disabled }) => {
  const { isPlaying } = UsePlayer();
  return (
    <button
      onClick={() => {}}
      className="font-semibold flex items-center justify-center bg-highlight hover:scale-[1.05] hover:bg-highlight-dark active:scale-[1.05] active:bg-highlight-dark rounded-full transition-all duration-300 text-sm md:text-md px-5 md:px-8 py-3 gap-2 text-foreground"
      disabled={disabled}
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
  );
};

export const DetailsLikeBtn = () => {
  return (
    <button
      className="bg-transparent text-foreground"
      onClick={() => {
        console.log("like", type);
      }}
    >
      <FaHeart size={24} className="hover:fill-red-500" />
    </button>
  );
};

export const DetailsDownloadBtn = ({ data }) => {
  const { downloadZip, isLoading: isDownloading } = UseDownload();
  return (
    <button
      onClick={() => downloadZip(data, data.name)}
      className="bg-transparent text-foreground hover:text-[#08B2F0] transition-colors flex items-center gap-2"
    >
      <FaDownload size={24} />{" "}
      {isDownloading && (
        <Spinner
          onClick={() => {
            console.log("download", data.name);
          }}
        />
      )}
    </button>
  );
};

export const DetailsBackdrop = ({ data, bgImage, theme }) => {
  return (
    <>
      <div
        className="absolute inset-0 z-0 h-full w-full opacity-80"
        style={{
          backgroundImage: data.thumbnail
            ? `url(${data.thumbnail})`
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
        className="absolute inset-0 w-full h-full z-10 backdrop-blur-[0.5px] bg-gradient-to-t from-background from-10% to-transparent to-200% bg-blend-color-burn"
        data-theme={theme}
      ></div>
    </>
  );
};

export const DetailsItemMainImage = ({ image, theme }) => {
  return (
    <div
      className="h-[10.85rem] aspect-square shadow-2xl rounded-lg"
      style={{
        backgroundImage: image?.startsWith("/")
          ? `url(${image})`
          : `url(${image}&w=300&dpr=2)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
      data-theme={theme}
    ></div>
  );
};

export const DetailsItemOwner = ({ fallbackImg, data, type, className }) => {
  return (
    <aside className={cn("flex gap-3 items-center", className)}>
      <div
        className="w-8 aspect-square rounded-full"
        style={{
          backgroundImage: data.ownerThumbnail
            ? `url(${data.ownerThumbnail})`
            : fallbackImg?.startsWith("/")
              ? `url(${fallbackImg})`
              : `url(${fallbackImg}&w=300&dpr=2)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
        }}
      ></div>
      <span className="font-bold">
        {type === "playlist" ? data.userName : data.artist}
      </span>
    </aside>
  );
};

export const DetailsFooter = ({ className, children }) => {
  return (
    <div className={cn("flex items-center gap-2 text-md", className)}>
      {children}
    </div>
  );
};
