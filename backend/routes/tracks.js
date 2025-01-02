import { Router } from 'express';
import { getTrendingTracks } from '../controllers/index.js';

const router = Router();

router.get('/trending', getTrendingTracks);

export default router;