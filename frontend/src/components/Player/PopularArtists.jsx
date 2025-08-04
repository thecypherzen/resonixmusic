import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ArtistCard from "../ArtistCard";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { useTheme } from "../../hooks/useTheme";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";

const transformArtists = (artist) => ({
  id: artist.id,
  name: artist.name,
  joinDate: artist.joindate || "Unknown",
  image:
    artist.image && artist.image.trim() !== ""
      ? artist.image
      : `https://usercontent.jamendo.com?type=artist&id=${artist.id}&width=300`,
  followerCount: artist.sharecount || 0,
});

/**
 * @function PopularArtists
 * @description Component that renders Tracks of most popular artists
 * @param props.cardsSet default number of cards to first render
 * @returns {React.ReactNode}
 */
const PopularArtists = ({ cardsPerSet = 5 }) => {
  const [visibleArtists, setVisibleArtists] = useState(0);
  const [dataState, setDataState] = useState({ artists: null, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const { data, error } = useFetch({
    type: "artists",
    method: "get",
  });

  useEffect(() => {
    if (data) {
      setDataState({ error: null, artists: data.map(transformArtists) });
      setIsLoading(false);
    } else if (error) {
      setDataState({
        error,
        artists: null,
      });
      setIsLoading(false);
    }
  }, [data, error]);
  // Use the custom hook for data fetching with caching and retry
  const handleArtistClick = useCallback((artist) => {
    window.scrollTo(0, 0);
    navigate(`/artist/${artist.id}`);
  }, []);
  const { theme } = useTheme();
  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : dataState.artists?.length ? (
    <div
      className="flex flex-col flex-wrap mb-10 overflow-y-scroll"
      data-theme={theme}
    >
      <div className="flex flex-row w-full mb-4 items-center">
        <HeadingText text={"Popular Artists"} />
        <div className="ml-auto flex gap-1 md:gap-2 items-center text-xs transition-all duration-300">
          <ActionButton
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/artists");
            }}
            text={"More"}
          />
        </div>
      </div>
      <div className="w-auto flex overflow-x-scroll scroll bg-transparent max-h-[24rem] gap-4 p-3 @container">
        {dataState.artists
          .slice(visibleArtists, visibleArtists + cardsPerSet)
          .map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              //onClick={handleArtistClick}
              onClick={() => console.log("clicked")}
            />
          ))}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={dataState.error?.reason || "An unnown reason"}
      prefix={"Loading Artists failed due to"}
      message={dataState.error?.message}
    />
  );
};

export default PopularArtists;
