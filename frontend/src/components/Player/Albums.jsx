import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import { FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import SectionSkeleton from "./SectionSkeleton";

const transformAlbum = (album) => ({
  id: album.id,
  title: album.name || album.title,
  artist: album.user_name || album.artist,
  thumbnail: album.image || album.thumbnail || DEFAULT_THUMBNAIL,
  trackCount: album.tracks_count || 0,
});

const Albums = ({ cardsPerSet = 5 }) => {
  const [visibleAlbums, setVisibleAlbums] = useState(0);
  const [dataState, setDataState] = useState({ albums: null, error: null });
  const [isLoading, setIsLoading] = useState(true);
  const handleAlbumClick = useCallback((album) => {
    window.scrollTo(0, 0);
    navigate(`/album/${album.id}`);
  }, []);
  const { data, error } = useFetch({ type: "albums", method: "get" });
  useEffect(() => {
    if (data) {
      setDataState({ error: null, albums: data.map(transformAlbum) });
      setIsLoading(false);
    } else if (error) {
      setDataState({ error, albums: null });
      setIsLoading(false);
    }
  }, [data, error]);

  return isLoading ? (
    <SectionSkeleton cardsPerset={cardsPerSet} />
  ) : dataState.albums?.length ? (
    <div className="flex flex-col mb-10">
      <div className="flex flex-row w-full mb-4 items-center">
        <p className="text-3xl font-extrabold">Albums for you</p>
        <div className="ml-auto flex gap-2 items-center">
          <button
            //onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronLeft />
          </button>
          <button
            //onClick={() =>
            //  handleNext(setVisibleAlbums, visibleAlbums, dataState.albums?.length)
            //}
            className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4 mt-4">
        {dataState?.albums
          .slice(visibleAlbums, visibleAlbums + cardsPerSet)
          .map((album) => (
            <button
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className="flex flex-col bg-white bg-opacity-[2%] rounded-xl w-[11.45rem] h-full p-3 gap-4 hover:border-none transition-all relative group hover:bg-opacity-5"
            >
              <div className="opacity-0 group-hover:opacity-100 flex bg-white w-10 h-10 rounded-full shadow-2xl absolute right-6 top-[7.5rem] hover:scale-110 transition-all duration-300">
                <FaPlay className="m-auto shadow-lg fill-black" />
              </div>
              <img
                src={album.thumbnail}
                className="rounded-xl h-auto w-full shadow-md object-cover"
                alt={`${album.title[0]}${album.title[1]}`}
              />
              <div className="flex flex-col text-left">
                <p className="font-bold text-lg w-95/100 truncate text-ellipsis">
                  {album.title}
                </p>
                <p className="font-bold text-sm text-neutral-400 w-4/5 truncate text-ellipsis">
                  {album.artist}
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  ) : (
    <SectionErrorDisplay
      reason={dataState?.error?.reason || "An unknown reason"}
      prefix={"Loading Albums failed due to"}
      message={dataState?.error?.message}
    />
  );
};

export default Albums;
