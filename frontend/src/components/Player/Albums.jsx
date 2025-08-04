import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import SectionSkeleton from "./SectionSkeleton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import ActionButton from "./ActionButton";
import HeadingText from "../HeadingText";
import { useTheme } from "../../hooks/useTheme";
import MusicCard from "../MusicCard";

const transformAlbum = (album) => ({
  id: album.id,
  title: album.name || album.title,
  artist: album.user_name || album.artist_name,
  thumbnail: album.image || album.thumbnail || DEFAULT_THUMBNAIL,
  trackCount: album.tracks_count || 0,
});

const Albums = ({ cardsPerSet = 5 }) => {
  const [visibleAlbums, setVisibleAlbums] = useState(0);
  const [dataState, setDataState] = useState({ albums: null, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const handleAlbumClick = useCallback((album) => {
    window.scrollTo(0, 0);
    navigate(`/album/${album.id}`);
  }, []);
  const { data, error } = useFetch({ type: "albums", method: "get" });
  useEffect(() => {
    if (data) {
      setDataState({ error: null, albums: data.map(transformAlbum) });
      setIsLoading(false);
    } else if (error) {
      setDataState({ error, albums: null });
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : dataState.albums?.length ? (
    <div className="flex flex-col mb-10">
      <div className="flex flex-row mb-4 items-center">
        <HeadingText text={"Featured Albums"} />
        <div className="ml-auto flex gap-2 items-center">
          <ActionButton text={"More"} />
        </div>
      </div>
      <div
        className="flex flex-row bg-transparent h-[16rem] w-full gap-4 mt-4 @container overflow-x-scroll py-4 px-2"
        data-theme={theme}
      >
        {dataState?.albums
          .slice(visibleAlbums, visibleAlbums + cardsPerSet)
          .map((album) => (
            <button
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className="flex flex-col bg-gradient-neutral-tb bg-opacity-[2%] rounded-xl h-full gap-4 transition-all relative group hover:bg-opacity-5 over-flow-hidden"
            >
              <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 flex bg-gradient-to-b from-yellow-300  to-green-400 size-10 rounded-full shadow-2xl absolute right-6 top-[7.5rem] hover:scale-110 active:scale-110 transition-all duration-300 z-100 !text-white">
                <FaPlay className="m-auto text-shadow-lg fill-[currentColor] text-shadow-neutral-900/20" />
              </div>
              <MusicCard
                variant="overlay"
                className="rounded-lg w-[160px] md:[200px]"
                imageUrl={album.thumbnail || "/thumbnail.png"}
              >
                <div className="flex flex-col text-left w-full">
                  <p className="font-bold text-md w-95/100 truncate text-ellipsis dark:text-neutral-100/90 text-neutral-900">
                    {album.title}
                  </p>
                  <p className="font-normal text-[0.75rem] text-neutral-200/70 w-95/100 truncate text-ellipsis">
                    {album.artist}
                  </p>
                </div>
              </MusicCard>
            </button>
          ))}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={dataState?.error?.reason || "An unknown reason"}
      prefix={"Loading Albums failed due to"}
      message={dataState?.error?.message}
    />
  );
};

export default Albums;
