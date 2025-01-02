import { Router } from 'express';
import {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
} from '../controllers/playlistControllers.js';

const router = Router();

router.get(
  '/search',
  searchPlaylists
);

router.get(
  '/trending',
  getTrendingPlaylists
);

router.get(
  '/:id',
  getPlaylistById
);

router.get(
  '/:id/tracks',
  getPlaylistTracks
);

export default router;