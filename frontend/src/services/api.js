import axios from 'axios';

const BASE_URL = 'http://localhost:5001';
const CURRENT_DATE = '2025-01-17 20:36:43';
const CURRENT_USER = 'gabrielisaacs';

// Define dummy data that matches Jamendo API structure
const DUMMY_DATA = {
  tracks: Array(30).fill(null).map((_, index) => ({
    id: `track-${index + 1}`,
    name: `Track ${index + 1}`,
    artist_name: `Artist ${Math.floor(index / 3) + 1}`,
    image: `https://picsum.photos/400/400?random=${index}`,
    audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 15) + 1}.mp3`,
    duration: 180 + (index * 30),
    sharecount: Math.floor(Math.random() * 500) + 50,
    is_streamable: "true",
    listened: Math.floor(Math.random() * 100000)
  })),

  artists: Array(15).fill(null).map((_, index) => ({
    id: `artist-${index + 1}`,
    name: `Artist ${index + 1}`,
    image: `https://picsum.photos/400/400?random=${index + 100}`,
    joindate: CURRENT_DATE,
    website: 'https://example.com'
  })),

  albums: Array(15).fill(null).map((_, index) => ({
    id: `album-${index + 1}`,
    name: `Album ${index + 1}`,
    artist_name: `Artist ${Math.floor(Math.random() * 15) + 1}`,
    image: `https://picsum.photos/400/400?random=${index + 200}`,
    tracks_count: Math.floor(Math.random() * 20) + 5,
    releasedate: CURRENT_DATE
  }))
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Transform functions to match frontend format
const transformTrackData = (track) => ({
  id: track.id,
  title: track.name,
  artist: track.artist_name,
  artwork: track.image,
  thumbnail: track.image,
  url: track.audio,
  duration: track.duration,
  likes: `${Math.floor((track.listened || 0) / 1000)}k Plays`,
  stream_url: track.audio
});

const transformArtistData = (artist) => ({
  id: artist.id,
  name: artist.name,
  thumbnail: artist.image,
  followerCount: parseInt(artist.joindate) || 0,
  profile_picture: {
    "150x150": artist.image
  }
});

const transformAlbumData = (album) => ({
  id: album.id,
  title: album.name,
  artist: album.artist_name,
  thumbnail: album.image,
  releaseDate: album.releasedate,
  trackCount: album.tracks_count || 0
});

export const getTrendingTracks = async (params = {}) => {
  try {
    console.log('Fetching trending tracks...');
    const response = await api.get('/tracks/trending', { params });
    console.log('Trending tracks response:', response);
    
    if (response.data && response.data.results) {
      return { data: response.data.results.map(transformTrackData) };
    }
    console.warn('Using fallback data for trending tracks');
    return { data: DUMMY_DATA.tracks.map(transformTrackData) };
  } catch (error) {
    console.warn('Error fetching tracks, using fallback data:', error);
    return { data: DUMMY_DATA.tracks.map(transformTrackData) };
  }
};

export const getPlaylists = async (params = {}) => {
  try {
    console.log('Fetching albums...');
    const response = await api.get('/albums', { params });
    console.log('Albums response:', response);
    
    if (response.data && response.data.results) {
      return { data: response.data.results.map(transformAlbumData) };
    }
    console.warn('Using fallback data for albums');
    return { data: DUMMY_DATA.albums.map(transformAlbumData) };
  } catch (error) {
    console.warn('Error fetching albums, using fallback data:', error);
    return { data: DUMMY_DATA.albums.map(transformAlbumData) };
  }
};

export const getTopArtists = async (params = {}) => {
  try {
    console.log('Fetching top artists...');
    const response = await api.get('/users/top', { params });
    console.log('Top artists response:', response);
    
    if (response.data && response.data.results) {
      return { data: response.data.results.map(transformArtistData) };
    }
    console.warn('Using fallback data for artists');
    return { data: DUMMY_DATA.artists.map(transformArtistData) };
  } catch (error) {
    console.warn('Error fetching artists, using fallback data:', error);
    return { data: DUMMY_DATA.artists.map(transformArtistData) };
  }
};

export const getAlbumDetails = async (albumId) => {
  try {
    console.log('Fetching album details for:', albumId);
    
    const response = await api.get('/albums');
    console.log('Albums response:', response);

    if (response.data && response.data.results) {
      const albumData = response.data.results.find(album => album.id === albumId);
      
      if (albumData) {
        // Transform the found album data
        const transformedAlbum = {
          id: albumData.id,
          title: albumData.name,
          artist: albumData.artist_name,
          thumbnail: albumData.image,
          releaseDate: albumData.releasedate,
          tracks: Array(8).fill(null).map((_, index) => ({
            id: `${albumData.id}-track-${index + 1}`,
            title: `${albumData.name} - Track ${index + 1}`,
            artist: albumData.artist_name,
            thumbnail: albumData.image,
            url: null,
            duration: 180 + (index * 30),
            likes: `${Math.floor(Math.random() * 100)}k`
          }))
        };

        return {
          data: {
            album: transformedAlbum,
            tracks: transformedAlbum.tracks
          }
        };
      }
    }

    // If album not found, return fallback data
    console.warn('Album not found, using fallback data');
    return {
      data: {
        album: {
          id: albumId,
          title: `Album ${albumId}`,
          artist: 'Unknown Artist',
          thumbnail: `https://picsum.photos/400/400?random=${albumId}`,
          releaseDate: CURRENT_DATE,
          tracks: Array(8).fill(null).map((_, index) => ({
            id: `${albumId}-track-${index + 1}`,
            title: `Track ${index + 1}`,
            artist: 'Unknown Artist',
            thumbnail: `https://picsum.photos/400/400?random=${index}`,
            duration: 180 + (index * 30),
            likes: `${Math.floor(Math.random() * 100)}k`
          }))
        }
      }
    };
  } catch (error) {
    console.error('Error fetching album details:', error);
    // Return fallback data on error
    return {
      data: {
        album: {
          id: albumId,
          title: `Album ${albumId}`,
          artist: 'Unknown Artist',
          thumbnail: `https://picsum.photos/400/400?random=${albumId}`,
          releaseDate: CURRENT_DATE,
          tracks: Array(8).fill(null).map((_, index) => ({
            id: `${albumId}-track-${index + 1}`,
            title: `Track ${index + 1}`,
            artist: 'Unknown Artist',
            thumbnail: `https://picsum.photos/400/400?random=${index}`,
            duration: 180 + (index * 30),
            likes: `${Math.floor(Math.random() * 100)}k`
          }))
        }
      }
    };
  }
};

// Enhanced debug interceptors
api.interceptors.request.use(
  config => {
    console.log('[API Request]', {
      method: config.method.toUpperCase(),
      url: config.url,
      params: config.params,
      timestamp: new Date().toISOString()
    });
    return config;
  },
  error => {
    console.error('[API Request Error]', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('[API Response]', {
      url: response.config.url,
      status: response.status,
      dataCount: response.data?.results?.length,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  error => {
    console.error('[API Response Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

export default {
  getPlaylists,
  getTrendingTracks,
  getTopArtists,
  getAlbumDetails
};