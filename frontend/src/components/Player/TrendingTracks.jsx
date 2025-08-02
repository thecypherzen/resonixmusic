import { useEffect, useState } from "react";
import api from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";

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
    <div className="flex flex-col mb-10">
      <div className="flex flex-row w-full mb-4 items-center">
        <p className="text-3xl font-extrabold">Trending Tracks</p>
        <div className="ml-auto flex gap-2 items-center transition-all duration-300">
          <button
            //onClick={handlePlayAll}
            className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm"
          >
            Play all
          </button>
          <button
            //onClick={() => handlePrevious(setVisibleTrending, visibleTrending)}
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronLeft />
          </button>
          <button
            //onClick={() =>
            //  handleNext(setVisibleTrending, visibleTrending, dataState.tracks.length)
            //}
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 transition-all duration-300">
        {dataState.tracks
          .slice(visibleTrending, visibleTrending + trendingCardsPerPage)
          .map((song, index) => (
            <button
              key={song.id}
              //onClick={() => handlePlaySong(song, index + visibleTrending)}
              className="flex flex-row bg-transparent hover:bg-white hover:bg-opacity-[2%] p-2 rounded-xl gap-3 group text-left transition-all"
            >
              <div className="flex relative">
                <img
                  src={song.thumbnail}
                  className="h-[3rem] w-[3rem] rounded-lg object-cover"
                  alt={`${song.title[0]}${song.title[1]}`}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FaPlay className="fill-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <p className="text-base truncate w-3/5 text-ellipsis">
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
