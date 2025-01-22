import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  getUsers,
  getUsersAlbums,
  getUsersArtists,
  getUsersTracks,
} from '../controllers/index.js';
import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  RESPONSE_CODES as resCodes
} from '../defaults/index.js';

const router = Router();
router.use(json());

router.get(
  '/albums',
  getUsersAlbums
);

router.get(
  '/artists',
  getUsersArtists
);

router.get(
  '/tracks',
  getUsersTracks
);

router.get(
  '/',
  getUsers
);

router.use((req, res) => {
  return res.status(404).send({
    headers: {
      status: 'failed',
      code: resCodes[22].code,
      error_message: resCodes[22].des,
      warning: '',
      'x-took': '0ms'
    }
  })
});

export default router;
