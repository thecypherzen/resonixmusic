import {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
} from './playlistControllers.js';

import {
  downloadTrack,
  getTrackById,
  getTrackDetails,
  getTrendingTracks,
  searchTracks,
  streamTrack,
} from './tracksControllers.js';

import {
  download as downloadAlbums,
  getInfo as getAlbumsInfo,
  getTracks as getAlbumTracks,
} from './albumsControllers.js'

export {
  // albums
  downloadAlbums,
  getAlbumsInfo,
  getAlbumTracks,

  // tracks
  downloadTrack,
  getTrackById,
  getTrackDetails,
  searchTracks,
  streamTrack,

  // playlists
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  getTrendingTracks,
  searchPlaylists,
 };
