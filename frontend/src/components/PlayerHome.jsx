import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { usePlayer } from '../context/PlayerContext';
import api from '../services/api';
import { MdErrorOutline } from "react-icons/md";

// Constants
const CURRENT_DATE = '2025-01-17 07:16:24';
const CURRENT_USER = 'gabrielisaacs';
const DEFAULT_THUMBNAIL = '/thumbnail.png';

// Data transformation functions
const transformJamendoTrack = (track) => ({
  id: track.id,
  title: track.name || track.title,
  artist: track.artist_name || track.artist,
  thumbnail: track.image || track.thumbnail || DEFAULT_THUMBNAIL,
  url: track.audio || track.url,
  duration: track.duration,
  likes: `${Math.floor((track.listened || 0) / 1000)}k Plays`
});

const transformJamendoArtist = (artist) => ({
  id: artist.id,
  name: artist.name,
  thumbnail: artist.image || artist.thumbnail || DEFAULT_THUMBNAIL,
  followerCount: artist.sharecount || 0
});

const transformJamendoAlbum = (album) => ({
  id: album.id,
  title: album.name || album.title,
  artist: album.user_name || album.artist,
  thumbnail: album.image || album.thumbnail || DEFAULT_THUMBNAIL,
  trackCount: album.tracks_count || 0
});

// Loading state component
const LoadingMessage = () => (
  <div className="flex mx-16 h-screen max-w-[60rem]">
    <div className="flex flex-col mt-[1.75rem]">
      <div className="animate-pulse flex flex-col ">
        <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
        <div className="grid grid-cols-5 gap-4 mt-[1rem]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          ))}
        </div>
      </div>

      <div className="animate-pulse flex flex-col mt-[5rem]">
        <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
        <div className="grid grid-cols-5 gap-4 mt-[1rem]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          ))}
        </div>
      </div>

      <div className="animate-pulse flex flex-col mt-[5rem]">
        <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl "></div>
        <div className="grid grid-cols-5 gap-4 mt-[1rem]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed">
    <div className="text-neutral-600 flex flex-col items-center">
      <MdErrorOutline size={102} className='m-auto' />
      <p className="text-2xl mb-2 font-extrabold">Unable to load content</p>
      <p className="text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);


const PlayerHome = () => {
  const { setCurrentTrack, setQueue } = usePlayer();
  const navigate = useNavigate();

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

  // Debug logging for state changes
  useEffect(() => {
    console.log('State Update:', {
      artistsCount: artists.length,
      albumsCount: albums.length,
      trendingSongsCount: trendingSongs.length,
      timestamp: CURRENT_DATE,
      user: CURRENT_USER
    });
  }, [artists, albums, trendingSongs]);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data at:', CURRENT_DATE);
        setLoading(true);

        // Fetch all data in parallel
        const [artistsResponse, playlistsResponse, tracksResponse] = await Promise.all([
          api.getTopArtists({ limit: 15 }),
          api.getPlaylists({ limit: 15, time: 'week' }),
          api.getTrendingTracks({ limit: 30 })
        ]);

        // Transform and set data
        setArtists(artistsResponse.data.map(transformJamendoArtist));
        setAlbums(playlistsResponse.data.map(transformJamendoAlbum));
        setTrendingSongs(tracksResponse.data.map(transformJamendoTrack));

        console.log('Data fetch complete:', {
          artists: artistsResponse.data.length,
          playlists: playlistsResponse.data.length,
          tracks: tracksResponse.data.length
        });

        console.log('Playlists/Albums raw data:', playlistsResponse.data);
        console.log('Transformed albums:', playlistsResponse.data.map(transformJamendoAlbum));

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation handlers
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

  // Playback handlers
  const handlePlaySong = (song, index) => {
    console.log('Playing song:', song);

    const trackToPlay = {
      id: song.id,
      title: song.title || song.name,
      artist: song.artist || song.artist_name,
      artwork: song.thumbnail || song.image || DEFAULT_THUMBNAIL,
      url: song.url || song.audio,
      duration: song.duration
    };

    const remainingSongs = trendingSongs
      .slice(index + 1)
      .map(track => ({
        id: track.id,
        title: track.title || track.name,
        artist: track.artist || track.artist_name,
        artwork: track.thumbnail || track.image || DEFAULT_THUMBNAIL,
        url: track.url || track.audio,
        duration: track.duration
      }));

    setCurrentTrack(trackToPlay);
    setQueue(remainingSongs);
    navigate(`/song/${song.id}`);
  };

  const handleArtistClick = (artist) => {
    console.log('Navigating to artist:', artist);
    navigate(`/artist/${artist.id}`);
  };

  const handleAlbumClick = (album) => {
    console.log('Navigating to album:', album);
    navigate(`/album/${album.id}`);
  };

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  // Loading state
  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;

  // No data state
  if (!artists.length && !albums.length && !trendingSongs.length) {
    console.log('No data available');
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">No content available</div>
      </div>
    );
  }

  // Main render
  return (
    <div className='max-w-[60rem] min-h-screen flex flex-col mt-6 mx-16 gap-10'>
      {/* Popular Artists Section */}
      {artists.length > 0 && (
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
          <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4">
            {artists.slice(visibleArtists, visibleArtists + cardsPerSet).map((artist) => (
              <button
                key={artist.id}
                onClick={() => handleArtistClick(artist)}
                className='flex flex-col bg-transparent hover:bg-gradient-to-b from-transparent via-neutral-950 to-neutral-900 hover:bg-opacity-5 rounded-2xl w-[11.5rem] h-[15rem] px-4 py-2 gap-4 hover:border-none transition-all relative group mt-4'
              >
                <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7rem] hover:scale-110 transition-all duration-300">
                  <FaPlay className='m-auto shadow-lg fill-black' />
                </div>
                <img
                  src={artist.thumbnail || DEFAULT_THUMBNAIL}
                  className="rounded-full h-[8.75rem] w-[8.75rem] shadow-lg mx-auto object-cover"
                  alt={artist.name}
                />
                <div className="flex flex-col text-left">
                  <p className='font-bold text-lg'>{artist.name}</p>
                  <p className='font-bold text-sm text-neutral-400'>Artist</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Albums section */}
      {albums.length > 0 && (
        <div className="flex flex-col mb-10">
          <div className='flex flex-row w-full mb-4 items-center'>
            <p className='text-3xl font-extrabold'>Albums for you</p>
            <div className='ml-auto flex gap-2 items-center'>
              <button
                onClick={() => handlePrevious(setVisibleAlbums, visibleAlbums)}
                className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => handleNext(setVisibleAlbums, visibleAlbums, albums.length)}
                className="bg-transparent hover:bg-[#212121] p-2 rounded-full border border-neutral-800"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="flex flex-row bg-transparent h-[16rem] w-full gap-4 mt-4">
            {albums.slice(visibleAlbums, visibleAlbums + cardsPerSet).map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumClick(album)}
                className='flex flex-col bg-white bg-opacity-[2%] rounded-xl w-[11.45rem] h-full p-3 gap-4 hover:border-none transition-all relative group hover:bg-opacity-5'
              >
                <div className="opacity-0 group-hover:opacity-100 flex bg-[#08B2F0] w-10 h-10 rounded-full shadow-lg absolute right-6 top-[7.5rem] hover:scale-110 transition-all duration-300">
                  <FaPlay className='m-auto shadow-lg fill-black' />
                </div>
                <img
                  src={album.thumbnail || DEFAULT_THUMBNAIL}
                  className="rounded-xl h-auto w-full shadow-md object-cover"
                  alt={album.title}
                />
                <div className="flex flex-col text-left">
                  <p className='font-bold text-lg'>{truncateTitle(album.title, 12)}</p>
                  <p className='font-bold text-sm text-neutral-400'>{truncateTitle(album.artist, 18)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Songs Section */}
      {trendingSongs.length > 0 && (
        <div className="flex flex-col mb-[10rem]">
          <div className='flex flex-row w-full mb-4 items-center'>
            <p className='text-3xl font-extrabold'>Trending Songs</p>
            <div className='ml-auto flex gap-2 items-center transition-all duration-300'>
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
          <div className="grid grid-cols-3 gap-2 transition-all duration-300">
            {trendingSongs
              .slice(visibleTrending, visibleTrending + trendingCardsPerPage)
              .map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => handlePlaySong(song, index + visibleTrending)}
                  className="flex flex-row bg-transparent hover:bg-white hover:bg-opacity-[2%] p-2 rounded-xl gap-3 group text-left transition-all"
                >
                  <div className="flex relative">
                    <img
                      src={song.thumbnail || DEFAULT_THUMBNAIL}
                      className='h-[3rem] w-[3rem] rounded-lg object-cover'
                      alt={song.title}
                    />
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
      )}
    </div>
  );
};

export default PlayerHome;