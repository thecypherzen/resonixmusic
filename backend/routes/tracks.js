import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  getTracks,
  downloadTracks,
} from '../controllers/index.js';

import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  RESPONSE_CODES as resCodes
} from '../defaults/index.js';

const router = Router();
router.use(json());

// Routes definition
router.use(
  '/',
  [
    query([
      'album_id', 'artist_id', 'fuzzy_tags',
      'id', 'include', 'lang', 'tags', 'type',
    ])
      .optional()
      .trim()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query([
      'album_id.*', 'artist_id.*', 'fuzzy_tags.*',
      'id.*', 'include.*', 'lang.*', 'tags.*', 'type.*',
    ])
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query(['album_id.*', 'artist_id.*', 'id.*'])
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('lang.*')
      .matches(/^[a-z]{2}$/)
      .withMessage('Expects 2-letter values like `fr`, `en`, etc.'),
    query([
      'album_name', 'artist_name',
      'name', 'name_search', 'search', 'x_artist'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('acoustic_electric')
      .optional()
      .trim()
      .isIn(['acoustic', 'electric'])
      .withMessage('Expects electric or electric'),
    query('audio_format')
      .optional()
      .trim()
      .isIn(['mp31', 'mp32', 'ogg', 'flac'])
      .withMessage('Expects mp31, mp32, ogg or flac'),
    query('boost')
      .optional()
      .trim()
      .isIn([
        'buzzrate', 'downloads_week', 'downloads_month',
        'downloads_month', 'downloads_total', 'listens_week',
        'listens_month', 'listens_total', 'popularity_week',
        'popularity_month', 'popularity_total'
      ])
      .withMessage('Invalid value passed. See docs.'),
    query('date_between')
      .optional()
      .trim()
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd'),
    query('duration_between')
      .optional()
      .trim()
      .matches(/^([0-9]+)_([0-9]+)$/)
      .withMessage('Expects format: from_to'),
    query(['featured', 'full_count'])
      .optional()
      .trim()
      .isBoolean({ strict: true })
      .withMessage('Expects true/faluse'),
    query('format')
      .optional()
      .trim()
      .isIn(['json', 'jsonpretty'])
      .withMessage('Expects json or jsonpretty'),
    query('gender')
      .optional()
      .trim()
      .isIn(['male', 'female'])
      .withMessage('Expect male or female'),
    query('group_by')
      .isIn(['artist_id', 'album_id'])
      .optional()
      .trim()
      .withMessage('Expects album_id or artist_id'),
    query('image_size')
      .optional()
      .trim()
      .isIn([
        20, 35, 50, 55, 60, 65, 70, 75, 85,
        100, 130, 150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
    query('order_by')
      .optional()
      .trim()
      .isIn([
        'relevance', 'buzzrate', 'downloads_week',
        'downloads_month', 'downloads_total', 'listens_week',
        'listens_month', 'listens_total', 'popularity_week',
        'popularity_month', 'popularity_total', 'name',
        'album_name', 'artist_name', 'releasedate', 'duration',
        'id'
      ])
      .withMessage('Invalid  order_by. See docs at /docs'),
    query('page')
      .default('1')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('page_size')
      .default(`${MIN_PAGE_SIZE}`)
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: MIN_PAGE_SIZE, max: MAX_PAGE_SIZE })
      .withMessage(`Expects an integer from ${MIN_PAGE_SIZE}`
                  + ` to ${MAX_PAGE_SIZE}`)
      .escape(),
    query('speed')
      .optional()
      .trim()
      .isIn([
        'high', 'low', 'medium',
        'veryhigh', 'verylow'
      ])
      .withMessage('Invalid speed. See docs at /docs'),
    query('vocal_instrumental')
      .optional()
      .trim()
      .isIn(['vocal', 'instrumental'])
      .withMessage('Expects vocal or instrumental'),
  ],
  getTracks
);

export default router;
