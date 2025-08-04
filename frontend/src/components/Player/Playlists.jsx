//import { useDataFetching } from "../../hooks/useDataFetching";
import SectionSkeleton from "./SectionSkeleton";
import helpers from "../../utils/utilityFunctions";
import { useFetch } from "../../hooks/useFetch";
import PlaylistCard from "../PlaylistCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import HeadingText from "../HeadingText";
import ActionButton from "./ActionButton";

const transformPlaylists = (playlist) => {
  return {
    id: playlist.id,
    title: helpers.capitalize(playlist.name) || "",
    artist: helpers.capitalize(playlist.user_name) || "",
    thumbnail: `https://usercontent.jamendo.com?type=playlist&id=${playlist.id}&width=300`,
    creationDate: playlist.creationdate,
    shareUrl: playlist.shareurl,
    shortUrl: playlist.shorturl,
    userId: playlist.user_d,
  };
};

const Playlists = ({ cardsPerSet = 5 }) => {
  const [visiblePlaylists, setVisiblePlaylists] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dataState, setDataState] = useState({ artists: null, error: null });

  const handlePlaylistClick = useCallback((playlist) => {
    window.scrollTo(0, 0);
    console.log("CLICKED ON: ", playlist.id);
    navigate(`/playlist/${playlist.id}`);
  }, []);

  const { data, error } = useFetch({ type: "playlists", method: "get" });

  useEffect(() => {
    if (data) {
      setDataState({ error: null, playlists: data.map(transformPlaylists) });
      setIsLoading(false);
    } else if (error) {
      setDataState({ error, playlists: null });
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : dataState?.playlists?.length ? (
    <div className="flex flex-col mb-[10rem]">
      <div className="flex flex-row mb-4 items-center">
        <HeadingText text={"Featured playlists"} />
        <div className="ml-auto flex gap-2 items-center">
          <ActionButton text={"Explore"} />
        </div>
      </div>
      <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4 mt-4 @container overflow-x-scroll py-4 px-2">
        {dataState?.playlists
          .slice(visiblePlaylists, visiblePlaylists + cardsPerSet)
          .map((playlist) => {
            return (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                //onClick={handlePlaylistClick}
                onClick={() => null}
              />
            );
          })}
      </div>
    </div>
  ) : (
    <div>
      <p>error</p>
    </div>
  );
};

export default Playlists;
