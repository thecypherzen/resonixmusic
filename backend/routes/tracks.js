import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  downloadTrack,
  getTrackById,
  getTrackDetails,
  getTrendingTracks,
  searchTracks,
  streamTrack,
} from '../controllers';

const router = Router();
router.use(json());
router.get(
  '/trending',
  [
    query('genre')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('genre must have a value')
      .matches(/^[a-zA-Z&\-_ ]+$/)
      .withMessage('genre can only contain letters, &, -, _ and spaces')
      .escape(),

    query('page')
      .default('1')
      .trim()
      .isInt({ gt: 0 })
      .withMessage('page can only be an integer > 0')
      .escape(),

    query('page_size')
      .default('20')
      .trim()
      .isInt({ min: 10, max: 40 })
      .withMessage('page_size can only be between 10-40')
      .escape(),

    query('time')
      .default('week')
      .trim()
      .isIn(['week', 'month', 'year', 'allTime'])
      .withMessage('time can only be week, month, year or allTime')
      .escape(),

    query('sort_by')
      .optional()
      .equals('release_date')
      .escape(),
  ],
  getTrendingTracks,
);

router.get(
  '/search',
  [
    query('query')
      .notEmpty()
      .trim()
      .withMessage('search requires `query` parameter')
      .escape(),
    query(['genre', 'key', 'mood'])
      .optional()
      .trim()
      .isArray()
      .withMessage(' must be an Array')
      .notEmpty()
      .withMessage('cannot be empty')
      .escape(),
    query('genre.*')
      .trim()
      .notEmpty()
      .withMessage('cannot be empty or falsy')
      .matches(/^[a-zA-Z &-_/]+$/)
      .withMessage('genre can only be letters, &, -, _ or /')
      .escape(),
    query('key.*')
      .trim()
      .notEmpty()
      .escape(),
    query('mood.*')
      .notEmpty()
      .withMessage('values cannot be empty or falsy')
      .trim()
      .matches(/^[a-zA-Z]+$/)
      .withMessage(' values can only be alphabets')
      .escape(),
    query(['bpm_max', 'bpm_min'])
      .optional()
      .trim()
      .isNumeric()
      .withMessage('must be a number')
      .escape(),
    query(['has_downloads', 'is_purchaseable',
      'includePurchaseable', 'only_downloadable'])
      .optional()
      .trim()
      .isBoolean({ strict: false })
      .isIn(['true', 'false'])
      .withMessage('can only be `true` or `false`')
      .escape(),
    query('sort_by')
      .optional()
      .trim()
      .isIn(['relevant', 'popular', 'recent'])
      .withMessage('only accepts `relevant`, `popular`, `recent`')
      .escape(),
  ],
  searchTracks,
);

router.get(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage('invalid id: can only be alphanumeric')
      .escape(),
  ],
  getTrackById,
);
export default router;
