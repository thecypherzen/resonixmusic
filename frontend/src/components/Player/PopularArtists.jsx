import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import SectionSkeleton from "./SectionSkeleton";
import ArtistCard from "../ArtistCard";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { useTheme } from "../../hooks/useTheme";
import HeadingText from "../HeadingText";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { transformArtist, dataPaginator, cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useIsMedia } from "@/hooks/useIsMobile";

/**
 * @function PopularArtists
 * @description Component that renders Tracks of most popular artists
 * @param props.cardsSet default number of cards to first render
 * @returns {React.ReactNode}
 */
const PopularArtists = () => {
  const {
    artists,
    setArtists,
    error: appError,
    setError: setAppError,
  } = UseAppState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMobile, isMd] = [useIsMedia(768), useIsMedia(960)];
  const pageSize = isMobile ? 4 : isMd ? 8 : 12;

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
      setArtists(dataPaginator(data.map(transformArtist), pageSize));
      setIsLoading(false);
      console.log("isMd:", isMd);
    } else if (error) {
      setArtists(null);
      setAppError(error);
      setIsLoading(false);
    }
  }, [data, error, isMd]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={pageSize} />
  ) : appError ? (
    <SectionErrorDisplay
      reason={appError?.reason || "An unknown reason"}
      prefix={"Loading Artists failed due to"}
      message={appError?.message}
    />
  ) : artists?.items?.length ? (
    <div className="flex flex-col flex-wrap mb-5 w-full" data-theme={theme}>
      <div className="flex flex-row w-full mb-4 items-center ">
        <HeadingText text={"Popular Artists"} />
        <div className="ml-auto flex gap-1 md:gap-2 items-center text-xs transition-all duration-300">
          {/* Navigation buttons */}
          <div className="flex gap-2">
            {/* Previous btn */}
            <button
              onClick={() => setArtists(artists.prev())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                artists.currentPage == 1 &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={artists.currentPage == 1}
            >
              <FaChevronLeft />
            </button>
            {/* Next btn */}
            <button
              onClick={() => setArtists(artists.next())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                artists.currentPage == artists.totalPages &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={artists.currentPage == artists.totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] bg-transparent w-full gap-4 mt-4 @container overflow-x-scroll  py-4 px-2">
        {artists.items.map((artist) => (
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
      reason={"No playlists data to display"}
      prefix={"Opps!"}
      message={"Try refreshing the page or check back later."}
    />
  );
};

export default PopularArtists;
