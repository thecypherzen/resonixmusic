import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ArtistCard from "../ArtistCard";
import SectionErrorDisplay from "./SectionErrorDisplay";

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
    console.log("data mararaba:", data);
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

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : dataState.artists?.length ? (
    <div className="flex flex-col mb-10 w-full">
      <div className="flex flex-row w-full mb-4 items-center">
        <p className="text-3xl font-extrabold">Popular Artists</p>
        <div className="ml-auto flex gap-2 items-center">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/artists");
            }}
            className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm"
          >
            More
          </button>
          <button
            onClick={() => console.log("clicked")}
            //onClick={() => handlePrevious(setVisibleArtists, visibleArtists)}
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronLeft />
          </button>
          <button
            //onClick={() => console.log("clicked")}
            onClick={() =>
              handleNext(
                setVisibleArtists,
                visibleArtists,
                dataState.artists.length
              )
            }
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4">
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
