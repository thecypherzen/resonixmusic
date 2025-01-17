// frontend/src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';
const CURRENT_DATE = '2025-01-17 06:44:04';
const CURRENT_USER = 'gabrielisaacs';

// Define dummy data that matches Jamendo API structure
const DUMMY_DATA = {
  tracks: Array(30).fill(null).map((_, index) => ({
    id: `track-${index + 1}`,
    name: `Track ${index + 1}`, // Changed from title to name to match Jamendo
    artist_name: `Artist ${Math.floor(index / 3) + 1}`, // Changed from artist to artist_name
    image: `https://picsum.photos/400/400?random=${index}`, // Changed from artwork/thumbnail to image
    audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 15) + 1}.mp3`, // Changed from url to audio
    duration: 180 + (index * 30),
    sharecount: Math.floor(Math.random() * 500) + 50, // Changed from likes to sharecount
    is_streamable: "true", // Added to match Jamendo API
    listened: Math.floor(Math.random() * 100000),
    addedBy: CURRENT_USER,
    addedAt: CURRENT_DATE
  })),

  artists: Array(15).fill(null).map((_, index) => ({
    id: `artist-${index + 1}`,
    name: `Artist ${index + 1}`,
    image: `https://picsum.photos/400/400?random=${index + 100}`, // Changed from thumbnail to image
    joindate: CURRENT_DATE, // Changed from followerCount to joindate
    website: 'https://example.com',
    addedBy: CURRENT_USER,
    addedAt: CURRENT_DATE
  })),

  playlists: Array(15).fill(null).map((_, index) => ({
    id: `album-${index + 1}`,
    name: `Album ${index + 1}`, // Changed from title to name
    user_name: `Artist ${Math.floor(Math.random() * 15) + 1}`, // Changed from artist to user_name
    image: `https://picsum.photos/400/400?random=${index + 200}`, // Changed from thumbnail to image
    tracks_count: Math.floor(Math.random() * 20) + 5, // Changed from trackCount to tracks_count
    addedBy: CURRENT_USER,
    addedAt: CURRENT_DATE
  }))
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Transform functions to match Jamendo API format
const transformTrackData = (track) => ({
  id: track.id,
  title: track.name, // Transform back to frontend format
  artist: track.artist_name, // Transform back to frontend format
  artwork: track.image, // Transform back to frontend format
  thumbnail: track.image,
  url: track.audio, // Transform back to frontend format
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

const transformPlaylistData = (playlist) => ({
  id: playlist.id,
  title: playlist.name,
  artist: playlist.user_name,
  thumbnail: playlist.image,
  trackCount: playlist.tracks_count
});

export const getTrendingTracks = async (params = {}) => {
  try {
    console.log('Fetching trending tracks...');
    const response = await api.get('/tracks/trending', { params });
    console.log('Trending tracks response:', response);
    const tracks = response.data?.results || DUMMY_DATA.tracks;
    return { data: tracks.map(transformTrackData) };
  } catch (error) {
    console.warn('Using fallback data for trending tracks');
    return { data: DUMMY_DATA.tracks.map(transformTrackData) };
  }
};

export const getPlaylists = async (params = {}) => {
  try {
    console.log('Fetching playlists...');
    const response = await api.get('/playlists/trending', { params });
    console.log('Playlists response:', response);
    const playlists = response.data?.results || DUMMY_DATA.playlists;
    return { data: playlists.map(transformPlaylistData) };
  } catch (error) {
    console.warn('Using fallback data for playlists');
    return { data: DUMMY_DATA.playlists.map(transformPlaylistData) };
  }
};

export const getTopArtists = async (params = {}) => {
  try {
    console.log('Fetching top artists...');
    const response = await api.get('/users/top', { params });
    console.log('Top artists response:', response);
    const artists = response.data?.results || DUMMY_DATA.artists;
    return { data: artists.map(transformArtistData) };
  } catch (error) {
    console.warn('Using fallback data for artists');
    return { data: DUMMY_DATA.artists.map(transformArtistData) };
  }
};

// Debug interceptors
api.interceptors.request.use(
  config => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config);
    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.config.url}:`, response.status, response.data);
    return response;
  },
  error => {
    console.error('[API Response Error]', error);
    return Promise.reject(error);
  }
);

export default {
  getPlaylists,
  getTrendingTracks,
  getTopArtists
};