import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShare,
  FaEllipsisH,
} from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { useFetch } from "../hooks/useFetch";
import api from "../services/api";
import { MdErrorOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import ArtistCard from "./ArtistCard";

const DEFAULT_THUMBNAIL = "/thumbnail.png";

const truncateTitle = (title, maxLength) => {
  if (!title) return "";
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
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

const ArtistDetails = ({ id }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const player = usePlayer();

  const { handleTrackSelect, currentTrack, isPlaying } = player;

  const [visibleAlbums, setVisibleAlbums] = useState(0);
  const [visibleArtists, setVisibleArtists] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [albumImages, setAlbumImages] = useState({});
  const cardsPerSet = 5;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isTrackPlaying = (track, currentTrack) => {
    return currentTrack?.id === track.id;
  };

  // Fetch artist data with caching
  const {
    data: artist,
    loading: loadingArtist,
    error: artistError,
    retry: retryArtist,
  } = useFetch(() => api.getArtistDetails(id), `artist-${id}`, [id]);

  // Fetch artist's songs
  const {
    data: songs,
    loading: loadingSongs,
    error: songsError,
    retry: retrySongs,
  } = useFetch(() => api.getArtistTracks(id), `artist-tracks-${id}`, [id]);

  // Fetch artist's albums
  const {
    data: albums,
    loading: loadingAlbums,
    error: albumsError,
    retry: retryAlbums,
  } = useFetch(() => api.getArtistAlbums(id), `artist-albums-${id}`, [id]);

  // Fetch similar artists
  const {
    data: similarArtists,
    loading: loadingSimilar,
    error: similarError,
    retry: retrySimilar,
  } = useFetch(() => api.getSimilarArtists(id), `similar-artists-${id}`, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getRandomImageForAlbum = async (albumId) => {
    if (albumImages[albumId]) return albumImages[albumId];

    try {
      const thumbnail = await api.getRandomImage("squarish");
      setAlbumImages((prev) => ({ ...prev, [albumId]: thumbnail }));
      return thumbnail;
    } catch (error) {
      console.error("Error getting random image:", error);
      return DEFAULT_THUMBNAIL;
    }
  };

  useEffect(() => {
    const fetchRandomImages = async () => {
      if (!albums) return;

      const albumsWithoutImages = albums.filter((album) => !album.image);
      const imagePromises = albumsWithoutImages.map((album) =>
        getRandomImageForAlbum(album.id)
      );

      await Promise.all(imagePromises);
    };

    fetchRandomImages();
  }, [albums]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

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
    navigate(`/album/${album.id}`);
  };

  const handleArtistClick = (artist) => {
    window.scrollTo(0, 0);
    navigate(`/artist/${artist.id}`);
  };

  const handleNext = (setVisible, visible, totalItems) => {
    if (visible + cardsPerSet < totalItems) {
      setVisible(visible + cardsPerSet);
    }
  };

  const handlePrevious = (setVisible, visible) => {
    if (visible - cardsPerSet >= 0) {
      setVisible(visible - cardsPerSet);
    }
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

  if (loadingArtist) return <LoadingState />;
  if (artistError)
    return <ErrorMessage message={artistError} onRetry={retryArtist} />;
  if (!artist) return <div>Artist not found</div>;

  return (
    <div className="flex-1 overflow-hidden w-full">
      {/* Artist Header */}
      <div className="relative min-h-[28rem] mb-20">
        {/* Background Image and Gradient */}
        <div className="absolute top-0 left-0 w-full h-[28rem]">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute bottom-0 w-full bg-gradient-to-b from-transparent via-[#121212] to-[#121212] h-[15rem]" />
        </div>

        {/* Content Container*/}
        <div className="relative z-10 px-16 pt-[7rem]">
          <div className="pt-8">
            <h1 className="text-7xl font-bold mb-6">{artist.name}</h1>
          </div>

          {/* Description Container*/}
          <div
            className={`transform ${
              showFullDescription
                ? "-translate-y-0 opacity-100"
                : "translate-y-0 opacity-100"
            }`}
          >
            {/* Description Section */}
            {artist.musicinfo?.description?.en && (
              <div className="mb-6">
                <div
                  className={`text-md text-white max-w-[40rem] ${
                    showFullDescription ? "" : "line-clamp-2"
                  }`}
                >
                  {stripHtmlTags(artist.musicinfo.description.en)}
                </div>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="bg-transparent text-neutral-400 hover:text-white text-sm mt-2"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              </div>
            )}

            {/* Tags Section */}
            <div
              className={`transition-all duration-300 ease-in-out transform ${
                showFullDescription ? "-translate-y-4" : "translate-y-0"
              }`}
            >
              {artist.musicinfo?.tags && artist.musicinfo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {artist.musicinfo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-8 mb-8">
                <button
                  onClick={handlePlayAll}
                  className="px-8 py-2 bg-[#08B2F0] text-black rounded-full hover:bg-opacity-85 transition-all flex items-center gap-2"
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
                      {artist.website && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(artist.website, "_blank");
                            setShowMenu(false);
                          }}
                          className="bg-transparent w-full text-left px-4 py-3 hover:bg-white/10 rounded-none"
                        >
                          Website
                        </button>
                      )}
                      {artist.shareurl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(artist.shareurl, "_blank");
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
        </div>
      </div>

      {/* Songs Section */}
      <div className="px-16 py-6">
        <h2 className="text-2xl font-bold mb-4">Songs</h2>
        {loadingSongs ? (
          <div className="animate-pulse grid grid-cols-3 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex gap-3 p-2">
                <div className="h-12 w-12 bg-neutral-800 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-neutral-800 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-neutral-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : songsError ? (
          <ErrorMessage message={songsError} onRetry={retrySongs} />
        ) : songs?.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => handlePlayTrack(song, index)}
                className="flex flex-row bg-transparent hover:bg-white hover:bg-opacity-[2%] p-2 rounded-xl gap-3 group text-left transition-all"
              >
                <div className="flex relative">
                  <img
                    src={song.thumbnail}
                    className="h-[3rem] w-[3rem] rounded-lg object-cover"
                    alt={song.title}
                    onError={(e) => {
                      e.target.src = DEFAULT_THUMBNAIL;
                    }}
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
                      isTrackPlaying(song, currentTrack) ? "text-[#08B2F0]" : ""
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
                    <p className="text-sm opacity-45 truncate">{song.likes}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400">No songs found</p>
        )}
      </div>

      {/* Albums Section */}
      <div className="px-16 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Albums</h2>
          {albums?.length > cardsPerSet && (
            <div className="flex gap-2">
              <button
                onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
                className="p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  handleNext(setVisibleAlbums, visibleAlbums, albums?.length)
                }
                className="p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
        {loadingAlbums ? (
          <div className="flex gap-4">
            {[...Array(cardsPerSet)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse w-[11.45rem] h-[15rem] bg-neutral-800 rounded-xl"
              />
            ))}
          </div>
        ) : albumsError ? (
          <ErrorMessage message={albumsError} onRetry={retryAlbums} />
        ) : albums?.length > 0 ? (
          <div className="flex gap-4">
            {albums
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
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                      src={
                        album.image || albumImages[album.id] || "/thumbnail.png"
                      }
                      className="rounded-xl w-full h-full object-cover"
                      alt={album.title}
                      onError={async (e) => {
                        const randomImage = await getRandomImageForAlbum(
                          album.id
                        );
                        e.target.src = randomImage;
                      }}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="font-bold text-lg">
                      {truncateTitle(album.title, 12)}
                    </p>
                    <p className="font-bold text-sm text-neutral-400">
                      {truncateTitle(album.artist, 18)}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        ) : (
          <p className="text-neutral-400">No albums found</p>
        )}
      </div>

      {/* Similar Artists Section */}
      <div className="px-16 py-6 mb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Artists you may like</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handlePrevious(setVisibleArtists, visibleArtists)}
              className="p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() =>
                handleNext(
                  setVisibleArtists,
                  visibleArtists,
                  similarArtists?.length
                )
              }
              className="p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          {similarArtists
            ?.slice(visibleArtists, visibleArtists + cardsPerSet)
            .map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onClick={handleArtistClick}
              />
            ))}
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
