import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaEllipsisH,
} from "react-icons/fa";
import { useFetch } from "../hooks/useFetch";
import { MdErrorOutline } from "react-icons/md";
import ArtistCard from "./ArtistCard";
import UsePlayer from "@/hooks/UsePlayer";
import {
  transformArtist,
  transformTrack,
  transformAlbum,
  dataPaginator,
  cn,
} from "@/lib/utils";
import { UseRandomImages } from "@/hooks/UseRandomImages";
import { useIsMedia } from "@/hooks/useIsMobile";
import { ThumbsUp } from "lucide-react";
import MusicCard from "./MusicCard";

const ArtistDetails = ({ id }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const player = UsePlayer();
  const isMobile = useIsMedia();

  const { handleTrackSelect, currentTrack, isPlaying } = player;
  const [visibleArtists, setVisibleArtists] = useState(null);
  const [visibleTracks, setVisibleTracks] = useState(null);
  const [visibleAlbums, setVisibleAlbums] = useState(null);
  const { fetchRandomImage } = UseRandomImages();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [infoDataState, setinfoDataState] = useState({
    error: null,
    info: null,
  });
  const [tracksDataState, setTracksDataState] = useState({
    error: null,
    tracks: null,
  });
  const [albumsDataState, setAlbumsDataState] = useState({
    error: null,
    albums: null,
  });
  const [similarDataState, setSimilarDataState] = useState({
    error: null,
    similar: null,
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const defaultPageItems = 6;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isTrackPlaying = (track, currentTrack) => {
    return currentTrack?.id === track.id;
  };

  // Fetch artist data with caching
  const { data: infoData, error: infoError } = useFetch({
    url: "/artists/info",
    extras: {
      params: {
        id: [id],
        format: "jsonpretty",
      },
    },
  });

  // Fetch artist's songs
  const { data: tracksData, error: tracksError } = useFetch({
    url: "/artists/tracks",
    params: {
      id: [id],
      audioformat: "mp31",
    },
  });

  // Fetch artist's albums
  const { data: albumsData, error: albumsError } = useFetch({
    url: "/artists/albums",
    extras: {
      params: {
        id: [id],
      },
    },
  });

  // Fetch similar artists
  const { data: similarData, error: similarError } = useFetch({
    url: "/artists/",
    params: {
      format: "jsonpretty",
      limit: 15,
      order: "popularity_total",
    },
  });

  /**
   * @hook
   * Update artist info when it's received
   */
  useEffect(() => {
    if (infoData) {
      setinfoDataState({
        error: null,
        info: transformArtist(infoData[0]),
      });
    } else if (infoError) {
      console.error("artistInfoError:", infoError);
      setinfoDataState({ error: infoError, info: null });
    }
  }, [infoData, infoError]);

  /**
   * @hook
   * Set artist's tracks when ready
   */
  useEffect(() => {
    if (tracksData) {
      setTracksDataState({
        error: null,
        tracks: tracksData
          .filter((art) => art.id === id)[0]
          .tracks.map(transformTrack),
      });
    } else if (tracksError) {
      setTracksDataState({ error: tracksError, tracks: null });
      console.error("tracksError:", tracksError);
    }
  }, [tracksData, tracksError, infoDataState.info]);

  /**
   * @hook
   * Set artist's albums, if any when ready
   */
  useEffect(() => {
    if (!infoDataState.info) return;
    if (albumsData) {
      setAlbumsDataState({
        error: null,
        albums: albumsData[0]?.albums?.map(transformAlbum),
      });
    } else if (albumsError) {
      console.error("albumsError:", albumsError);
      setAlbumsDataState({ error: albumsError, albums: null });
    }
  }, [albumsData, albumsError]);

  /**
   * @hook
   * Set artist similar data
   */
  useEffect(() => {
    if (similarData) {
      setSimilarDataState({
        error: null,
        similar: similarData.map(transformArtist),
      });
    } else if (similarError) {
      console.error("similarError", similarError);
      setSimilarDataState({ error: similarError });
    }
  }, [similarData, similarError]);

  /** */
  useEffect(() => {
    if (
      infoDataState.info &&
      albumsDataState.albums &&
      tracksDataState.tracks &&
      similarDataState.similar
    ) {
      setVisibleAlbums(
        dataPaginator(albumsDataState.albums, isMobile ? 5 : defaultPageItems),
      );
      setVisibleArtists(
        dataPaginator(
          similarDataState.similar,
          isMobile ? 5 : defaultPageItems,
        ),
      );
      setVisibleTracks(
        dataPaginator(tracksDataState.tracks, isMobile ? 12 : 15),
      );
      console.log("turning off isloading");
      setIsLoading(false);
    }
  }, [
    infoDataState.info,
    albumsDataState.albums,
    tracksDataState.tracks,
    similarDataState.similar,
  ]);

  const handlePlayAll = () => {
    if (!songs?.length) return;

    try {
      handleTrackSelect(songs[0], songs);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const handlePlayTrack = (track, index) => {
    if (!songs?.length) return;

    try {
      handleTrackSelect(track, songs);
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const handleAlbumClick = (album) => {
    window.scrollTo(0, 0);
    navigate(`/albums/${album.id}`);
  };

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  };

  const handleMenuToggle = () => {
    setShowMenu((prev) => !prev);
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="overflow-hidden w-full">
      {/* Artist Header */}
      <div className="relative">
        {infoDataState.error ? (
          <div className="px-5 md:px-8 lg:px-16 py-6 mt-10">
            Failed to fetch data because: {infoDataState.error.reason}
          </div>
        ) : (
          <>
            {/* Background Image and Gradient */}
            <div className="inset-0 absolute top-0 left-0">
              <img
                src={
                  infoDataState.info.thumbnail ||
                  fetchRandomImage("artists", id)
                }
                alt={infoDataState.info.name}
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-b from-transparent via-background h-[15rem]" />
            </div>

            {/* Content Container*/}
            <div className="relative z-10 px-5 md:px-8 lg:px-16 pt-[6rem] pb-[1rem]">
              {infoDataState.info ? (
                <>
                  <h1 className="text-4xl md:text-7xl font-bold mb-6">
                    {infoDataState.info.name}
                  </h1>

                  {/* Description Container*/}
                  <div
                    className={`transform ${
                      showFullDescription
                        ? "-translate-y-0 opacity-100"
                        : "translate-y-0 opacity-100"
                    }`}
                  >
                    {/* Description Section */}
                    {infoDataState.info.musicInfo?.description?.en && (
                      <div className="mb-6">
                        <div
                          className={`text-md text-white max-w-[40rem] ${
                            showFullDescription ? "" : "line-clamp-2"
                          }`}
                        >
                          {stripHtmlTags(
                            infoDataState.info.musicInfo.description.en,
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                          className="bg-transparent text-neutral-400 hover:text-white text-sm mt-2"
                        >
                          {showFullDescription ? "Show less" : "Show more"}
                        </button>
                      </div>
                    )}

                    {/* Tags and btn actions Section */}
                    <div
                      className={`transition-all duration-300 ease-in-out transform ${
                        showFullDescription ? "-translate-y-4" : "translate-y-0"
                      }`}
                    >
                      {infoDataState.info.musicInfo?.tags &&
                        infoDataState.info.musicInfo.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {infoDataState.info.musicInfo.tags.map(
                              (tag, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300"
                                >
                                  {tag}
                                </span>
                              ),
                            )}
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-8 mb-8">
                        <button
                          onClick={handlePlayAll}
                          className="px-5 md:px-8 py-1 md:py-2 bg-highlight text-highlight-foreground rounded-full hover:bg-highlight-dark transition-all flex items-center gap-2"
                        >
                          <FaPlay /> Play all
                        </button>

                        <button className="bg-transparent text-white">
                          <FaHeart
                            size={24}
                            className="hover:fill-red-500 transition-colors duration-300"
                          />
                        </button>

                        <div className="relative" ref={menuRef}>
                          <button
                            onClick={handleMenuToggle}
                            className="bg-transparent hover:bg-white/10 p-2 rounded-full"
                          >
                            <FaEllipsisH size={24} />
                          </button>

                          {showMenu && (
                            <div className="absolute left-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-xl border border-neutral-600 z-50">
                              {infoDataState.info?.website && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      infoDataState.info.website,
                                      "_blank",
                                    );
                                    setShowMenu(false);
                                  }}
                                  className="bg-transparent w-full text-left px-4 py-3 hover:bg-white/10 rounded-none"
                                >
                                  Website
                                </button>
                              )}
                              {infoDataState.info?.shareUrl && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      infoDataState.info.shareUrl,
                                      "_blank",
                                    );
                                    setShowMenu(false);
                                  }}
                                  className="bg-transparent w-full text-left px-4 py-3 hover:bg-white/10 rounded-none"
                                >
                                  Share
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-5 md:px-8 lg:px-16 py-6 mt-10">
                  An error occurred while fetching track data <br />
                  Try again Later
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Songs Section */}
      <div className="px-5 md:px-8 lg:px-16 mt-10 @container">
        {tracksDataState.error ? (
          <div className="px-5 md:px-8 lg:px-16 py-6 mt-10">
            {tracksDataState.error.reason} while fetching tracks
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold mb-6">{`Songs by ${infoDataState.info.name}`}</h2>
              {/* Navigation buttons */}
              <div className="flex gap-2">
                {/* Previous btn */}
                <button
                  onClick={() => setVisibleTracks(visibleTracks.prev())}
                  className={cn(
                    "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                    visibleTracks.currentPage == 1 &&
                      "cursor-not-allowed hover:bg-transparent opacity-50",
                  )}
                  disabled={visibleTracks.currentPage == 1}
                >
                  <FaChevronLeft />
                </button>
                {/* Next btn */}
                <button
                  onClick={() => setVisibleTracks(visibleTracks.next())}
                  className={cn(
                    "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                    visibleTracks.currentPage == visibleTracks.totalPages &&
                      "cursor-not-allowed hover:bg-transparent opacity-50",
                  )}
                  disabled={
                    visibleTracks.currentPage == visibleTracks.totalPages
                  }
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {visibleTracks?.items ? (
              <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @4xl:grid-cols-4 gap-2 space-between">
                {visibleTracks.items.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => handlePlayTrack(song, index)}
                    className="flex flex-row bg-transparent hover:bg-white/10 p-2 rounded-xl gap-3 group text-left transition-all"
                  >
                    <div className="flex relative">
                      <img
                        src={
                          song.thumbnail || fetchRandomImage("tracks", song.id)
                        }
                        className="h-[3rem] w-[3rem] rounded-lg object-cover"
                        alt={song.title}
                        style={{ fontSize: "0.75rem" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity">
                        {isTrackPlaying(song, currentTrack) ? (
                          <FaPause className="fill-white drop-shadow-lg" />
                        ) : (
                          <FaPlay className="fill-white drop-shadow-lg" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p
                        className={`text-base truncate ${
                          isTrackPlaying(song, currentTrack)
                            ? "text-highlight"
                            : ""
                        }`}
                      >
                        {song.title}
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        {song.album_name && (
                          <>
                            <p className="text-sm opacity-45 truncate">
                              {song.album_name}
                            </p>
                            <span className="h-1.5 w-1.5 bg-white opacity-45 rounded-full flex-shrink-0"></span>
                          </>
                        )}
                        <p className="text-sm opacity-45 truncate flex gap-1">
                          {song.likes}&nbsp;
                          <span>
                            <ThumbsUp size={16} />
                          </span>
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                {" "}
                {infoDataState.info.name}&nbsp;has no songs{" "}
              </p>
            )}
          </>
        )}
      </div>

      {/* Albums Section */}

      {albumsDataState.error ? (
        <div className="px-5 md:px-8 lg:px-16 py-6 mt-10">
          {albumsDataState.error.reason} while fetching albums
        </div>
      ) : (
        visibleAlbums.items && (
          <div className="px-5 md:px-8 lg:px-16 py-6 mt-10 @container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold mb-6">{`${infoDataState.info.name}'s Albums`}</h2>
              {/* Navigation buttons */}
              <div className="flex gap-2">
                {/* Previous btn */}
                <button
                  onClick={() => setVisibleAlbums(visibleAlbums.prev())}
                  className={cn(
                    "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                    visibleAlbums.currentPage == 1 &&
                      "cursor-not-allowed hover:bg-transparent opacity-50",
                  )}
                  disabled={visibleAlbums.currentPage == 1}
                >
                  <FaChevronLeft />
                </button>
                {/* Next btn */}
                <button
                  onClick={() => setVisibleAlbums(visibleAlbums.next())}
                  className={cn(
                    "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                    visibleAlbums.currentPage == visibleAlbums.totalPages &&
                      "cursor-not-allowed hover:bg-transparent opacity-50",
                  )}
                  disabled={
                    visibleAlbums.currentPage == visibleAlbums.totalPages
                  }
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            {/* Album Cards */}
            <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 @5xl:grid-cols-5 gap-4">
              {visibleAlbums.items.map((album) => (
                <button
                  key={album.id}
                  onClick={() => handleAlbumClick(album)}
                  className="flex max-w-full flex-col bg-white/6 rounded-xl min-h-[16rem] p-2 gap-4 hover:border-none transition-all relative group hover:bg-opacity-5"
                >
                  <div className="opacity-0 group-hover:opacity-100 flex bg-white w-10 h-10 rounded-full shadow-2xl absolute right-6 top-[7.5rem] hover:scale-110 transition-all duration-300">
                    <FaPlay className="m-auto shadow-lg fill-background" />
                  </div>

                  <MusicCard
                    variant="default"
                    bgImageUrl={
                      album.image || fetchRandomImage("albums", album.id)
                    }
                    className="w-full"
                  >
                    <div className="flex flex-col text-left px-2">
                      <p className="line-clamp-3 text-ellipsis font-medium leading-tight text-xl w-full truncate whitespace-pre-wrap  dark:text-neutral-100 text-neutral-900">
                        {album.title}
                      </p>
                    </div>
                  </MusicCard>
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {/* Similar Artists Section */}
      <div className="px-5 md:px-8 lg:px-16 py-6 mt-10 @container">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold mb-6">Artists you may like</h2>
          {/* Navigation buttons */}
          <div className="flex gap-2">
            {/* Previous btn */}
            <button
              onClick={() => setVisibleArtists(visibleArtists.prev())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                visibleArtists.currentPage == 1 &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={visibleArtists.currentPage == 1}
            >
              <FaChevronLeft />
            </button>
            {/* Next btn */}
            <button
              onClick={() => setVisibleArtists(visibleArtists.next())}
              className={cn(
                "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
                visibleArtists.currentPage == visibleArtists.totalPages &&
                  "cursor-not-allowed hover:bg-transparent opacity-50",
              )}
              disabled={visibleArtists.currentPage == visibleArtists.totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 @5xl:grid-cols-5 gap-4">
          {similarDataState.error ? (
            <div className="px-5 md:px-8 lg:px-16 py-6 mt-10">
              {similarDataState.error.reason} while fetching data
            </div>
          ) : (
            visibleArtists?.items.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={() => navigate(`/artist/${artist.id}`)}
                namespace="artists"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const SectionLoadingMessage = () => (
  <div className="animate-pulse flex flex-col">
    <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl"></div>
    <div className="grid grid-cols-5 gap-4 mt-[1rem]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"
        ></div>
      ))}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex mx-16 h-screen max-w-[60rem]">
    <div className="flex flex-col mt-[1.75rem] gap-[5rem]">
      {[...Array(3)].map((_, index) => (
        <SectionLoadingMessage key={index} />
      ))}
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex justify-center items-center p-4 bg-neutral-900 rounded-lg">
    <div className="text-neutral-400 flex flex-col items-center">
      <MdErrorOutline size={24} className="mb-2" />
      <p className="text-sm mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm px-4 py-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

export default ArtistDetails;
