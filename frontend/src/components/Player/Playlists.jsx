//import { useDataFetching } from "../../hooks/useDataFetching";
import SectionSkeleton from "./SectionSkeleton";
import { useFetch } from "../../hooks/useFetch";
import PlaylistCard from "../PlaylistCard";
import { useEffect, useState } from "react";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { cn, dataPaginator, transformPlaylist } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Playlists = ({ pageSize = 6 }) => {
  const {
    playlists,
    setPlaylists,
    error: appError,
    setError: setAppError,
  } = UseAppState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { data, error } = useFetch({ url: "/playlists", method: "get" });

  useEffect(() => {
    if (data) {
      setPlaylists(dataPaginator(data.map(transformPlaylist), pageSize));
      setIsLoading(false);
    } else if (error) {
      setPlaylists(null);
      setAppError(error);
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={pageSize} />
  ) : appError ? (
    <SectionErrorDisplay
      reason={appError?.reason || "some reason"}
      prefix={"Loading playlists failed due to: "}
      message={appError?.message}
    />
  ) : playlists?.items?.length ? (
    <div className="flex flex-col mb-4">
      <div className="flex flex-row mb-4 items-center">
        <HeadingText text={"Featured Playlists"} />
        <div className="ml-auto flex gap-2 items-center">
          <ActionButton text={"More"} />
          {/* Navigation */}
          <div className="flex gap-2">
            {/* Previous btn */}
            <button
              onClick={() => setPlaylists(playlists.prev())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                playlists.currentPage == 1 &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={playlists.currentPage == 1}
            >
              <FaChevronLeft />
            </button>
            {/* Next btn */}
            <button
              onClick={() => setPlaylists(playlists.next())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                playlists.currentPage == playlists.totalPages &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={playlists.currentPage == playlists.totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      {/* Playlists */}
      <div className="flex flex-row flex-wrap bg-transparent w-full gap-4 mt-4 @container py-4 px-2">
        {playlists.items.map((playlist) => {
          return (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onClick={() => {
                const t = setTimeout(() => {
                  navigate(`/playlists/${playlist.id}`);
                  clearTimeout(t);
                }, 200);
              }}
              namespace="playlists"
            />
          );
        })}
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

export default Playlists;
