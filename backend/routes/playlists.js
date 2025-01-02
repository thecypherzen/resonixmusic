import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
} from '../controllers';

const router = Router();
router.use(json());

router.get(
  '/search',
  [
    query('query')
      .notEmpty()
      .withMessage('query cannot be empty')
      .isString()
      .withMessage('query must be a string')
      .escape()
      .withMessage('unrecognized values passed'),

    query(['genre', 'mood'])
      .optional()
      .trim()
      .isArray()
      .withMessage('must be an array of strings')
      .notEmpty()
      .withMessage('cannot be empty')
      .escape(),
    query('genre.*')
      .trim()
      .notEmpty()
      .withMessage('genre values cannot be empty or falsy')
      .matches(/^[a-zA-Z -_&/]+$/)
      .withMessage('must be letter with _, /, space or -')
      .escape(),
    query('mood.*')
      .trim()
      .notEmpty()
      .withMessage('mood values cannot be empty or falsy')
      .matches(/^[a-zA-Z -_&/]+$/)
      .withMessage('must be letter with _, /, space or - ')
      .escape(),
    query('sort_by')
      .trim()
      .default('relevant')
      .isString()
      .withMessage('sort_by must be a string')
      .isIn(['relevant', 'popular', 'recent'])
      .withMessage('can only be `relevant`, `popular` or `recent`')
      .escape(),
  ],
  searchPlaylists,
);

router.get(
  '/trending',
  [
    query('limit')
      .default('-1')
      .trim()
      .isInt()
      .withMessage('limit must be an integer')
      .escape(),

    query('time')
      .default('week')
      .isIn(['allTime', 'month', 'week', 'year'])
      .withMessage('time can only be alltime, month, week or year')
      .escape(),

    query('sort_by')
      .optional()
      .isIn(['tracks', 'plays'])
      .withMessage('sort_by can only be tracks or plays')
      .escape(),
  ],
  getTrendingPlaylists,
);

router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .escape(),
  ],
  getPlaylistById,
);

router.get(
  '/:id/tracks',
  [
    param('id')
      .notEmpty()
      .escape(),
  ],
  getPlaylistTracks,
);

export default router;
