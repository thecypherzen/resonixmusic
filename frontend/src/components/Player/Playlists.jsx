//import { useDataFetching } from "../../hooks/useDataFetching";
import SectionSkeleton from "./SectionSkeleton";
import { useFetch } from "../../hooks/useFetch";
import PlaylistCard from "../PlaylistCard";
import { useEffect, useState } from "react";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { dataPaginator, transformPlaylist } from "@/lib/utils";
import { useIsMedia } from "@/hooks/useIsMobile";
import { SectionDataNavigation, SectionErrorDisplay } from "../ContentSection";

const Playlists = ({ pageSize = 6 }) => {
  const {
    playlists,
    setPlaylists,
    error: appError,
    setError: setAppError,
  } = UseAppState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, isMd] = [useIsMedia(768), useIsMedia(1114)];

  const { data, error } = useFetch({ url: "/playlists", method: "get" });
  const ps = isMobile ? 4 : isMd ? pageSize : 8;

  useEffect(() => {
    if (data) {
      setPlaylists(dataPaginator(data.map(transformPlaylist), ps));
      setIsLoading(false);
    } else if (error) {
      setPlaylists(null);
      setAppError(error);
      setIsLoading(false);
    }
  }, [data, error, isMobile, isMd]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={ps} />
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
          <SectionDataNavigation items={playlists} itemsSetter={setPlaylists} />
        </div>
      </div>
      {/* Playlists */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] bg-transparent w-full gap-4 mt-4 @container py-4 px-2">
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
