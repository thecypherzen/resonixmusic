import axios from 'axios';

const BASE_URL = 'http://localhost:5005';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTrendingTracks = async (params = {}) => {
  try {
    const response = await api.get('/tracks/trending', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    throw error;
  }
};

export const getTopArtists = async (params = {}) => {
  try {
    const response = await api.get('/users/top', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};

export const getPlaylists = async (params = {}) => {
  try {
    const response = await api.get('/playlists/trending', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending playlists:', error);
    throw error;
  }
};


// Health check function
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data.status === 'OK';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Search playlists
export const searchPlaylists = async (query, params = {}) => {
  try {
    const response = await api.get('/playlists/search', {
      params: {
        query,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching playlists:', error);
    throw error;
  }
};

// Get tracks from a playlist
export const getPlaylistTracks = async (playlistId) => {
  try {
    const response = await api.get(`/playlists/${playlistId}/tracks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
};

// Get playlist by ID
export const getPlaylistById = async (playlistId) => {
  try {
    const response = await api.get(`/playlists/${playlistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw error;
  }
};


// Add interceptors for debugging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.status);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default {
  getPlaylists,
  searchPlaylists,
  getPlaylistTracks,
  getPlaylistById,
  getTrendingTracks,
  getTopArtists,
};