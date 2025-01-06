import {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
} from './playlistControllers.js';

import { getTrendingTracks } from './trackControllers.js';
import { getTopArtists } from './userControllers.js';

import {
  downloadTrack,
  getTrackById,
  getTrackDetails,
  getTrendingTracks,
  searchTracks,
  streamTrack,
} from './tracksControllers';

export {
  downloadTrack,
  getPlaylistById,
  getPlaylistTracks,
  getTrackById,
  getTrackDetails,
  getTrendingPlaylists,
  getTrendingTracks,
  searchPlaylists,
  tracks
  searchTracks,
  streamTrack,
  getTrendingTracks,
  getTopArtists,
};
