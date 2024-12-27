import { Router, json } from 'express';
import { getTrendingPlaylists } from '../controllers';

const router = Router();
router.use(json());

router.get('/trending', getTrendingPlaylists);

export default router;
