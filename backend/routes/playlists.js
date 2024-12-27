import { Router, json } from 'express';
import {
  getPlaylistById,
  getTrendingPlaylists,
} from '../controllers';

const router = Router();
router.use(json());

router.get('/trending', getTrendingPlaylists);
router.get('/:id', getPlaylistById);
export default router;
