import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";

const transformTracks = (track) => ({
  id: track.id,
  title: track.name || track.title,
  artist: track.artist_name || track.artist,
  thumbnail: track.image || track.thumbnail || DEFAULT_THUMBNAIL,
  url: track.audio || track.url,
  duration: track.duration,
  likes: `${Math.floor((track.listened || 0) / 1000)}k Plays`,
});

/**
 * @function TrendingTracks
 * @description Component that renders trending tracks
 * @returns {React.ReactNode}
 */
const TrendingTracks = () => {
  const trendingCardsPerPage = 12;
  const [visibleTrending, setVisibleTrending] = useState(0);
  const [dataState, setDataState] = useState({ tracks: null, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const DEFAULT_THUMBNAIL = "/thumbnail.png";

  const { data, error } = useFetch({ type: "tracks", method: "get" });

  useEffect(() => {
    if (data) {
      setDataState({ error: null, tracks: data.map(transformTracks) });
      setIsLoading(false);
    } else if (error) {
      setDataState({ error, tracks: null });
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton />
  ) : dataState.tracks?.length ? (
    <div className="w-full flex flex-col mb-10">
      {/* Heading and Action button */}
      <div className="flex flex-row w-full mb-4 items-center">
        <HeadingText text={"Trending Tracks"} />
        <div className="ml-auto flex gap-1 md:gap-2 items-center text-xs transition-all duration-300">
          <ActionButton text={"Play All"} />
        </div>
      </div>
      {/* Tracks */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-1 transition-all duration-300 max-h-[50vh] overflow-y-auto @container">
        {dataState.tracks
          .slice(visibleTrending, visibleTrending + trendingCardsPerPage)
          .map((song, index) => (
            <button
              key={song.id}
              //onClick={() => handlePlaySong(song, index + visibleTrending)}
              className="w-95/100 mx-auto flex bg-transparent hover:bg-gradient-to-r from-neutral-800 to-neutral-900 active:bg-gradient-to-r from-neutral-800 to-neutral-900 px-2 py-4 rounded-xl gap-4 group text-left transition-all"
            >
              <div className="w-1/5 relative">
                <div
                  className="flex size-[62px] aspect-ratio-square bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg"
                  style={{
                    backgroundImage: `url(${song.thumbnail})`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FaPlay className="fill-white drop-shadow-lg" />
                </div>
              </div>
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
      reason={dataState.error?.reason || "An unknown reason"}
      prefix={"Loading Tracks failed due to"}
      message={dataState.error?.message}
    />
  );
};

export default TrendingTracks;
