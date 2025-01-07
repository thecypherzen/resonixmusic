import { Router } from 'express';
import { param, query } from 'express-validator';

import {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
} from '../controllers/playlistControllers.js';

const router = Router();

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
  searchPlaylists
);

router.get(
  '/trending',
  getTrendingPlaylists
);

router.get(
  '/:id',
  getPlaylistById
);

router.get(
  '/:id/tracks',
  getPlaylistTracks
);

export default router;
