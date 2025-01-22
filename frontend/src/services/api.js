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
  })),

  playlists: Array(15).fill(null).map((_, index) => ({
    id: `playlist-${index + 1}`,
    name: `Playlist ${index + 1}`,
    creationdate: CURRENT_DATE,
    user_id: `user-${index + 1}`,
    user_name: `User ${index + 1}`,
    image: `https://picsum.photos/400/400?random=${index + 200}`,
    shorturl: `https://jamen.do/l/p${index + 1}`,
    shareurl: `https://www.jamendo.com/list/p${index + 1}`
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
  image: artist.image,
  joindate: artist.joindate || '2025-01-22 23:01:16',
  website: artist.website || '',
  shorturl: artist.shorturl || '',
  shareurl: artist.shareurl || ''
});

const transformAlbumData = (album) => ({
  id: album.id,
  title: album.name,
  artist: album.artist_name,
  thumbnail: album.image,
  releaseDate: album.releasedate,
  trackCount: album.tracks_count || 0
});

const transformPlaylistData = (playlist) => ({
  id: playlist.id,
  title: playlist.name,
  artist: playlist.user_name,
  creationDate: playlist.creationdate,
  userId: playlist.user_id,
  shortUrl: playlist.shorturl,
  shareUrl: playlist.shareurl,
  thumbnailId: playlist.id
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

export const getAlbums = async (params = {}) => {
  try {
    console.log('Fetching albums...');
    const response = await api.get('/albums', { 
      params: {
        ...params,
        format: 'json',
        imagesize: 500
      }
    });
    
    if (response.data?.results) {
      return { data: response.data.results.map(transformAlbumData) };
    }
    throw new Error('No data received from server');
  } catch (error) {
    console.warn('Error fetching albums, using fallback data:', error);
    return { data: DUMMY_DATA.albums.map(transformAlbumData) };
  }
};

export const getTopArtists = async (params = {}) => {
  try {
    console.log('Fetching top artists...');
    const response = await api.get('/artists', { 
      params: {
        ...params,
        limit: params.limit || 20,
        order: 'popularity_week_desc'
      }
    });
    
    if (response.data?.results) {
      return { 
        data: response.data.results.map(artist => transformArtistData(artist))
      };
    }
    throw new Error('No data received from server');
  } catch (error) {
    console.warn('Error fetching artists, using fallback data:', error);
    return { data: DUMMY_DATA.artists.map(transformArtistData) };
  }
};

export const getAlbumDetails = async (albumId) => {
  try {
    console.log('Fetching album details for:', albumId);
    
    const response = await api.get('/albums/tracks', { 
      params: { 
        id: [albumId],
        image_size: 400,
        audio_format: 'mp32'
      } 
    });

    console.log('Album and tracks response:', response);

    if (response.data?.results?.[0]) {
      const albumData = response.data.results[0];
      const tracks = albumData.tracks || [];

      // Transform the album data
      const transformedAlbum = {
        id: albumData.id,
        title: albumData.name,
        artist: albumData.artist_name,
        thumbnail: albumData.image,
        releaseDate: albumData.releasedate,
        // Transform tracks
        tracks: tracks.map(track => ({
          id: track.id,
          title: track.name,
          artist: albumData.artist_name,
          thumbnail: track.image || track.thumbnail || albumData.image,
          url: track.audio,
          duration: parseInt(track.duration),
          position: parseInt(track.position),
          likes: `${Math.floor(Math.random() * 100)}k`,
          download_url: track.audiodownload,
          download_allowed: track.audiodownload_allowed
        }))
      };

      // Sort tracks by position
      transformedAlbum.tracks.sort((a, b) => a.position - b.position);

      return {
        data: {
          album: transformedAlbum,
          tracks: transformedAlbum.tracks
        }
      };
    }

    throw new Error('Album not found');
  } catch (error) {
    console.error('Error fetching album details:', error);
    // Return fallback data
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
            position: index + 1,
            likes: `${Math.floor(Math.random() * 100)}k`,
            download_url: null,
            download_allowed: false
          }))
        }
      }
    };
  }
};

export const getPlaylists = async (params = {}) => {
  try {
    console.log('Fetching playlists...');
    const response = await api.get('/playlists', { 
      params: {
        ...params,
        format: 'json'
      }
    });
    
    if (response.data?.results) {
      return { data: response.data.results.map(transformPlaylistData) };
    }
    throw new Error('No data received from server');
  } catch (error) {
    console.warn('Error fetching playlists, using fallback data:', error);
    return { data: DUMMY_DATA.playlists.map(transformPlaylistData) };
  }
};

export const getRecentTracks = async (params = {}) => {
  try {
    console.log('Fetching recent tracks...');
    const response = await api.get('/tracks', { 
      params: {
        orderby: ['releasedate_desc'],
        limit: params.limit || 30,
        ...params
      }
    });
    console.log('Recent tracks response:', response);
    
    if (response.data && response.data.results) {
      return { data: response.data.results.map(transformTrackData) };
    }
    console.warn('Using fallback data for recent tracks');
    return { data: DUMMY_DATA.tracks.map(transformTrackData) };
  } catch (error) {
    console.warn('Error fetching recent tracks, using fallback data:', error);
    return { data: DUMMY_DATA.tracks.map(transformTrackData) };
  }
};

export const getPlaylistDetails = async (playlistId) => {
  try {
    console.log('Fetching playlist details for:', playlistId);
    
    const response = await api.get(`/playlists/id[]=${playlistId}/tracks`, { 
      params: { 
        format: 'json',
        imagesize: 400
      } 
    });

    if (response.data?.results?.[0]) {
      const playlistData = response.data.results[0];
      const tracks = playlistData.tracks || [];

      const transformedPlaylist = {
        id: playlistData.id,
        title: playlistData.name,
        artist: playlistData.user_name,
        creationDate: playlistData.creationdate,
        userId: playlistData.user_id,
        shortUrl: playlistData.shorturl,
        shareUrl: playlistData.shareurl,
        tracks: tracks.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artist_name,
          thumbnail: track.image,
          url: track.audio,
          duration: parseInt(track.duration),
          position: parseInt(track.position) || 0,
          likes: `${Math.floor((track.listened || 0) / 1000)}k Plays`
        }))
      };

      return {
        data: {
          playlist: transformedPlaylist,
          tracks: transformedPlaylist.tracks
        }
      };
    }

    throw new Error('Playlist not found');
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
};

// Enhanced debug interceptors
api.interceptors.request.use(
  config => {
    config.params = {
      format: 'json',
      ...config.params
    };

    // Add imagesize if the endpoint is albums or playlists
    if (config.url.includes('/albums') || config.url.includes('/playlists')) {
      config.params.imagesize = config.params.imagesize || 500;
    }
    
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
  getAlbumDetails,
  getPlaylistDetails,
  getRecentTracks,
  getAlbums
};