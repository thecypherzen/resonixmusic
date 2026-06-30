import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import { FaPlay } from "react-icons/fa";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";
import { UseAppState } from "@/hooks/UseAppState";
import { dataPaginator, transformTrack } from "@/lib/utils";
import { useIsMedia } from "@/hooks/useIsMobile";
import { SectionDataNavigation, SectionErrorDisplay } from "../ContentSection";

/**
 * @function TrendingTracks
 * @description Component that renders trending tracks
 * @returns {React.ReactNode}
 */
const TrendingTracks = ({ pageSize = 12 }) => {
  const {
    trendingTracks,
    setTrendingTracks,
    error: appError,
    setError: setAppError,
  } = UseAppState();
  const [isMobile, isMd] = [useIsMedia(768), useIsMedia(1114)];
  const [isLoading, setIsLoading] = useState(true);
  const { data, error } = useFetch({ url: "/tracks", method: "get" });
  const ps = isMobile ? 6 : isMd ? 8 : pageSize;

  useEffect(() => {
    if (data) {
      setTrendingTracks(dataPaginator(data.map(transformTrack), ps));
      setIsLoading(false);
    } else if (error) {
      setTrendingTracks(null);
      setAppError(error);
      setIsLoading(false);
    }
  }, [data, error, isMd, isMobile]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={ps} />
  ) : appError ? (
    <SectionErrorDisplay
      reason={appError?.reason || "An unknown reason"}
      prefix={"Loading Tracks failed due to: "}
      message={appError?.message}
    />
  ) : trendingTracks?.items?.length ? (
    <div className="w-full flex flex-col mb-10">
      {/* Heading and Action button */}
      <div className="flex flex-row w-full mb-4 items-center">
        <HeadingText text={"Trending Tracks"} />
        <div className="ml-auto flex gap-1 md:gap-2 items-center text-xs transition-all duration-300">
          <ActionButton text={"Play All"} />
          {/* Navigation */}
          <SectionDataNavigation
            items={trendingTracks}
            itemsSetter={setTrendingTracks}
          />
        </div>
      </div>
      {/* Tracks */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-1 transition-all duration-300 @container">
        {trendingTracks.items.map((song) => (
          <button
            key={song.id}
            //onClick={() => handlePlaySong(song, index + visibleTrending)}
            className="w-95/100 mx-auto flex bg-transparent hover:bg-gradient-to-r from-neutral-800 to-neutral-900 active:bg-gradient-to-r  px-2 py-4 rounded-xl gap-4 group text-left transition-all"
          >
            {/* Image */}
            <div className="relative">
              <div
                className="flex size-[62px] aspect-square bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg"
                style={{
                  backgroundImage: `url(${song.thumbnail})`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <FaPlay className="fill-white drop-shadow-lg" />
              </div>
            </div>
            {/* Track details */}
            <div className="flex flex-col w-4/5">
              <p className="text-base w-9/10 truncate text-ellipsis">
                {song.title}
              </p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-sm opacity-45 truncate">{song.artist}</p>
                <span className="h-2 w-2 bg-white opacity-45 rounded-full flex-shrink-0"></span>
                <p className="text-sm opacity-45 truncate">{song.likes}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={"No tracks to display"}
      prefix={"Opps!"}
      message={"Try refreshing the page or check back later."}
    />
  );
};

export default TrendingTracks;
