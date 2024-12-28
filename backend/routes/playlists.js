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

    query('genre')
      .optional()
      .isArray()
      .withMessage('genre must be an array of strings')
      .escape(),
    query('genre.*')
      .notEmpty()
      .withMessage('genre values cannot be empty or falsy')
      .matches(/^[a-zA-Z]+$/)
      .withMessage('genre values must contain only letters')
      .escape(),
    query('mood')
      .optional()
      .isArray()
      .withMessage('mood must be an array of strings')
      .escape(),
    query('mood.*')
      .notEmpty()
      .withMessage('mood values cannot be empty or falsy')
      .matches(/^[a-zA-Z]+$/)
      .withMessage('mood values must contain only letters')
      .escape(),
    query('sort_by')
      .default('relevant')
      .isString()
      .withMessage('sort_by must be a string')
      .isIn(['relevant', 'popular', 'recent'])
      .withMessage('sort by can only be relevant, popular or recent')
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
