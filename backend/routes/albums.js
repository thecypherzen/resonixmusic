import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  downloadAlbums,
  getAlbumsInfo,
  getAlbumTracks,
} from '../controllers/index.js';

const router = Router();
router.use(json());

router.get(['/', '/info'], getAlbumsInfo);
router.get('/download', downloadAlbums);
router.get('/tracks', getAlbumTracks);

export default router;
