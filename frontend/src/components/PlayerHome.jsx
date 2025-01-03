import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';
import { MdErrorOutline } from "react-icons/md";

const PlayerHome = () => {
  const { setCurrentTrack, setQueue } = usePlayer();

  // State for data
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [visibleArtists, setVisibleArtists] = useState(0);
  const [visibleAlbums, setVisibleAlbums] = useState(0);
  const [visibleTrending, setVisibleTrending] = useState(0);

  // Constants
  const cardsPerSet = 5;
  const trendingCardsPerPage = 12;
  const defaultThumbnail = '/src/assets/png-jpg/thumbnail.png';

  const navigate = useNavigate();

  const handleSongClick = (song) => {
    // Update the current track
    setCurrentTrack(song);
    // Navigate to the song details page
    navigate(`/song/${song.id}`);
  };

  // Add loading state message component
  const LoadingMessage = () => (
    <div className="flex mx-16 h-screen max-w-[60rem]">
      <div className="flex flex-col mt-[1.75rem]">
        <div className="animate-pulse flex flex-col ">
          <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
          <div className="grid grid-cols-5 gap-4 mt-[1rem]">
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          </div>
        </div>

        <div className="animate-pulse flex flex-col mt-[5rem]">
          <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
          <div className="grid grid-cols-5 gap-4 mt-[1rem]">
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          </div>
        </div>

        <div className="animate-pulse flex flex-col mt-[5rem]">
          <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
          <div className="grid grid-cols-5 gap-4 mt-[1rem]">
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
            <div className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add error message component
  const ErrorMessage = ({ message }) => (
    <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed">
      <div className="text-red-500 flex flex-col items-center">
        <MdErrorOutline size={102} className='m-auto' />
        <p className="text-xl mb-2 font-extrabold ">Unable to load content</p>
        <p className="text-sm">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-600 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch trending playlists
        const response = await api.getPlaylists();
        console.log('Received data:', response);

        // Fetch all data in parallel
        const [artistsResponse, playlistsResponse, tracksResponse] = await Promise.all([
          api.getTopArtists({ limit: 15 }),
          api.getPlaylists({ limit: 15, time: 'week' }),
          api.getTrendingTracks({ limit: 30 })
        ]);

        // Transform artists data
        const transformedArtists = artistsResponse.data.map(artist => ({
          id: artist.id,
          name: artist.name,
          thumbnail: artist.profile_picture?.["150x150"] || defaultThumbnail,
          followerCount: artist.follower_count
        }));
        setArtists(transformedArtists);

        // Transform playlists/albums data
        const transformedAlbums = playlistsResponse.data.map(playlist => ({
          id: playlist.id,
          title: playlist.playlist_name || "Untitled Playlist",
          artist: playlist.user?.name || "Unknown Artist",
          thumbnail: playlist.artwork?.["150x150"] || defaultThumbnail,
          trackCount: playlist.track_count
        }));
        setAlbums(transformedAlbums);

        // Transform tracks data
        const transformedTracks = tracksResponse.data.map(track => ({
          id: track.id,
          title: track.title || "Untitled Track",
          artist: track.user?.name || "Unknown Artist",
          likes: `${Math.floor((track.play_count || 0) / 1000)}k Plays`,
          thumbnail: track.artwork?.["150x150"] || defaultThumbnail,
          url: track.stream_url,
          duration: track.duration
        }));
        setTrendingSongs(transformedTracks);

      } catch (err) {
        console.error('Error in PlayerHome:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;


  // Handlers for navigation
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

  // Handler for playing a song
  const handlePlaySong = (song) => {
    setCurrentTrack(song);
    // Set the rest of the songs as queue
    const currentIndex = trendingSongs.findIndex(s => s.id === song.id);
    const remainingSongs = trendingSongs.slice(currentIndex + 1);
    setQueue(remainingSongs);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  const truncateTitle = (title, maxLength) => title.length > maxLength ? title.slice(0, maxLength) + '...' : title;

  return (
    <div className='max-w-[60rem] min-h-screen flex flex-col mt-6 mx-16 gap-10'>
      {/* Popular Artists Section */}
      <div className="flex flex-col mb-10 w-full">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Popular Artists</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm">
              More
            </button>
            <button
              onClick={() => handlePrevious(setVisibleArtists, visibleArtists)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleArtists, visibleArtists, artists.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        {/* Artists Cards */}
        <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4">
          {artists.slice(visibleArtists, visibleArtists + cardsPerSet).map((artist, index) => (
            <a key={index} href='#' className='flex flex-col bg-transparent hover:bg-gradient-to-b from-transparent via-neutral-950 to-neutral-900 hover:bg-opacity-5 rounded-2xl w-[11.5rem] h-[15rem] px-4 py-2 gap-4 hover:border-none transition-all relative group mt-4'>
              <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7rem]">
                <FaPlay className='m-auto shadow-lg fill-black' />
              </div>
              <img src={artist.thumbnail} className="rounded-full h-[8.75rem] w-[8.75rem] shadow-lg mx-auto" alt={artist.name} />
              <div className="flex flex-col text-left">
                <p className='font-bold text-lg'>{artist.name}</p>
                <p className='font-bold text-sm text-neutral-400'>Artist</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Albums section */}
      <div className="flex flex-col mb-10">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Albums for you</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button
              onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleAlbums, visibleAlbums, albums.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800">
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="flex flex-row bg-transparent h-auto w-full gap-4 mt-4">
          {albums.slice(visibleAlbums, visibleAlbums + cardsPerSet).map((album, index) => (
            <a key={index} href='#' className='flex flex-col bg-white bg-opacity-[2%] rounded-xl w-[11.45rem] h-full p-3 gap-4 hover:border-none transition-all relative group hover:bg-opacity-5'>
              <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7.5rem]">
                <FaPlay className='m-auto shadow-lg fill-black' />
              </div>
              <img src={album.thumbnail} className="rounded-xl h-auto w-full shadow-md" />
              <div className="flex flex-col text-left">
                <p className='font-bold text-lg'>{truncateTitle(album.title, 25)}</p>
                <p className='font-bold text-sm text-neutral-400'>{album.artist}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Trending Songs Section */}
      <div className="flex flex-col mb-[6rem]">
        <div className='flex flex-row w-full mb-4 items-center'>
          <p className='text-3xl font-extrabold'>Trending Songs</p>
          <div className='ml-auto flex gap-2 items-center'>
            <button className="bg-transparent hover:bg-[#212121] py-2 px-4 rounded-full border border-neutral-800 text-sm">
              Play all
            </button>
            <button
              onClick={() => handlePrevious(setVisibleTrending, visibleTrending)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleNext(setVisibleTrending, visibleTrending, trendingSongs.length)}
              className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 ">
          {trendingSongs
            .slice(visibleTrending, visibleTrending + trendingCardsPerPage)
            .map((song, index) => (
              <button
                key={index}
                onClick={() => handlePlaySong(song)}
                className="flex flex-row bg-transparent hover:bg-white hover:bg-opacity-[2%] p-2 rounded-xl gap-3 group text-left transition-all"
              >
                <div className="flex relative ">
                  <img src={song.thumbnail} className='h-[3rem] w-[3rem] rounded-lg' alt={song.title} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FaPlay className='fill-white drop-shadow-lg' />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <p className='text-base truncate'>{truncateTitle(song.title, 20)}</p>
                  <div className="flex flex-row items-center gap-2">
                    <p className='text-sm opacity-45 truncate'>{song.artist}</p>
                    <span className='h-2 w-2 bg-white opacity-45 rounded-full flex-shrink-0'></span>
                    <p className='text-sm opacity-45 truncate'>{song.likes}</p>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerHome;