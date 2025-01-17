import { Router } from 'express';
import { getTopArtists } from '../controllers/users/userControllers.js';

const router = Router();

router.get('/top', getTopArtists);

export default router;