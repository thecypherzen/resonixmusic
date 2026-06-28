import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import SectionSkeleton from "./SectionSkeleton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import ActionButton from "./ActionButton";
import HeadingText from "../HeadingText";
import { useTheme } from "../../hooks/useTheme";
import MusicCard from "../MusicCard";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { cn, dataPaginator, transformAlbum } from "@/lib/utils";

const Albums = ({ pageSize = 6 }) => {
  const [visibleAlbums] = useState(0);
  const {
    albums,
    setAlbums,
    error: appError,
    setError: setAppError,
  } = UseAppState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { data, error } = useFetch({ url: "/albums", method: "get" });

  useEffect(() => {
    if (data) {
      setAlbums(dataPaginator(data.map(transformAlbum), pageSize));
      setIsLoading(false);
    } else if (error) {
      setAlbums(null);
      setAppError(error);
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={pageSize} />
  ) : appError ? (
    <SectionErrorDisplay
      reason={appError?.reason || "An unknown reason"}
      prefix={"Loading Albums failed due to: "}
      message={appError?.message}
    />
  ) : albums?.items?.length ? (
    <div className="flex flex-col mb-10">
      <div className="flex flex-row mb-4 items-center">
        <HeadingText text={"Albums For You"} />
        <div className="ml-auto flex gap-2 items-center">
          <ActionButton text={"More"} />
          {/* Navigation */}
          <div className="flex gap-2">
            {/* Previous btn */}
            <button
              onClick={() => setAlbums(albums.prev())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                albums.currentPage == 1 &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={albums.currentPage == 1}
            >
              <FaChevronLeft />
            </button>
            {/* Next btn */}
            <button
              onClick={() => setAlbums(albums.next())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                albums.currentPage == albums.totalPages &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={albums.currentPage == albums.totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex flex-row bg-transparent h-[16rem] w-full gap-4 mt-4 @container overflow-x-scroll py-4 px-2"
        data-theme={theme}
      >
        {albums.items.map((album) => (
          <button
            key={album.id}
            onClick={() => {
              const t = setTimeout(() => {
                navigate(`/albums/${album.id}`);
                clearTimeout(t);
              }, 200);
            }}
            className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] bg-gradient-neutral-tb bg-opacity-[2%] rounded-xl h-full gap-4 transition-all relative group hover:bg-opacity-5 over-flow-hidden"
          >
            <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 flex bg-gradient-to-b from-purple-300  to-blue-600 size-10 rounded-full shadow-2xl absolute right-6 top-[7.5rem] hover:scale-110 active:scale-110 transition-all duration-300 z-100 !text-white">
              <FaPlay className="m-auto text-shadow-lg fill-[currentColor] text-shadow-neutral-900/20" />
            </div>
            <MusicCard
              variant="overlay"
              className="rounded-lg w-full shadow-md shadow-black "
              bgImageUrl={album.thumbnail || "/thumbnail.png"}
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
      reason={"No albumsto display"}
      prefix={"Opps!"}
      message={"Try refreshing the page or check back later."}
    />
  );
};

export default Albums;
