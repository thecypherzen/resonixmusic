//import { useDataFetching } from "../../hooks/useDataFetching";
import SectionSkeleton from "./SectionSkeleton";
import { useFetch } from "../../hooks/useFetch";
import PlaylistCard from "../PlaylistCard";
import { useCallback, useEffect, useState } from "react";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";
import SectionErrorDisplay from "./SectionErrorDisplay";
import { useNavigate } from "react-router-dom";
import { UseAppState } from "@/hooks/UseAppState";
import { transformPlaylist } from "@/lib/utils";

const Playlists = ({ cardsPerSet = 5 }) => {
  const { playlists, setPlaylists, setSelectedPlaylist } = UseAppState();
  const [visiblePlaylists, _] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { data, error } = useFetch({ url: "/playlists", method: "get" });

  useEffect(() => {
    if (data) {
      setPlaylists(data.map(transformPlaylist));
      setIsLoading(false);
    } else if (error) {
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : playlists?.length ? (
    <div className="flex flex-col mb-4">
      <div className="flex flex-row mb-4 items-center">
        <HeadingText text={"Featured Playlists"} />
        <div className="ml-auto flex gap-2 items-center">
          <ActionButton text={"More"} />
        </div>
      </div>
      <div className="flex flex-row bg-transparent h-[16rem] md:h-[18rem] w-full gap-4 mt-4 @container overflow-x-scroll py-4 px-2">
        {playlists
          .slice(visiblePlaylists, visiblePlaylists + cardsPerSet)
          .map((playlist, index) => {
            return (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => {
                  const t = setTimeout(() => {
                    setSelectedPlaylist(playlists[index]);
                    navigate(`/playlists/${playlist.id}`);
                  }, 200);
                }}
              />
            );
          })}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={error?.reason || "An unnown reason"}
      prefix={"Loading Artists failed due to"}
      message={error?.message}
    />
  );
};

export default Playlists;
