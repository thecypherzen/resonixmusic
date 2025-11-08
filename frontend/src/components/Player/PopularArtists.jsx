import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import ArtistCard from "../ArtistCard";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { useTheme } from "../../hooks/useTheme";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { transformArtist } from "@/lib/utils";

/**
 * @function PopularArtists
 * @description Component that renders Tracks of most popular artists
 * @param props.cardsSet default number of cards to first render
 * @returns {React.ReactNode}
 */
const PopularArtists = ({ cardsPerSet = 12 }) => {
  const [visibleArtists] = useState(0);
  const { artists, setArtists } = UseAppState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Fetch artists
  const { data, error } = useFetch({
    url: "/artists",
    method: "get",
    extras: {
      params: {
        order: ["popularity_total"],
      },
    },
  });

  useEffect(() => {
    if (data) {
      setArtists(data.map(transformArtist));
      setIsLoading(false);
    } else if (error) {
      setDataState({
        error,
        artists: null,
      });
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : artists?.length ? (
    <div className="flex flex-col flex-wrap mb-5 w-full" data-theme={theme}>
      <div className="flex flex-row w-full mb-4 items-center ">
        <HeadingText text={"Popular Artists"} />
        <div className="ml-auto flex gap-1 md:gap-2 items-center text-xs transition-all duration-300">
          <ActionButton text={"More"} />
        </div>
      </div>
      <div className="grid grid-rows-2 auto-cols-[minmax(220px,1fr)] grid-flow-col  bg-transparent w-full gap-4 mt-4 @container overflow-x-scroll overflow-y-hidden py-4 px-2">
        {artists
          .slice(visibleArtists, visibleArtists + cardsPerSet)
          .map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => {
                const t = setTimeout(() => {
                  navigate(`/artists/${artist.id}`);
                  clearTimeout(t);
                }, 200);
              }}
            />
          ))}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={error?.reason || "An unknown reason"}
      prefix={"Loading Artists failed due to"}
      message={error?.message}
    />
  );
};

export default PopularArtists;
