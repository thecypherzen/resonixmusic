import {
  Router,
  json,
  urlencoded,
} from 'express';
import { body } from 'express-validator';
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
router.use(urlencoded({ extended: true }));

router.post(
  '/dislike',
  [
    body('access_token')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    body('format')
      .default('jsonpretty')
      .trim()
      .isIn(['json', 'jsonpretty'])
      .withMessage('Expects json or jsonpretty')
      .escape(),
    body('full_count')
      .optional()
      .trim()
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage('Expects true/false')
      .escape(),
    body('track_id')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
  ],
  postDislike
);
router.post('/fan', postFan);
router.post('/favorite', postFavorite);
router.post('/like', postLike);
router.post('/myalbum', postMyAlbum);
router.use('/', (req, res) => {
  return res.send({controller: 'rollback'});
})

export default router;
