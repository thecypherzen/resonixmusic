import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  postDislike,
  postFan,
  postFavorite,
  postLike,
  postMyAlbum,
} from '../controllers/index.js';
import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  RESPONSE_CODES as resCodes
} from '../defaults/index.js';

const router = Router();
router.use(json());

router.post('/dislike', postDislike);
router.post('/fan', postFan);
router.post('/favorite', postFavorite);
router.post('/like', postLike);
router.post('/myalbum', postMyAlbum);
router.use('/', (req, res) => {
  return res.send({controller: 'rollback'});
})

export default router;
