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
      .notEmpty('Cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query([
      'album_id*', 'artist_id.*', 'fuzzy_tags.*',
      'id.*', 'include.*', 'lang.*', 'tags.*', 'type.*',
    ])
      .notEmpty()
      .withMessage("Value cannot be empty")
      .escape(),
    query(['album_id.*', 'artist_id.*', 'id.*'])
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('lang.*')
      .matches(/^[a-z]{2}$/)
      .withMessage('Expects 2-letter values like `fr`, `en`, etc.'),
    query([
      'acoustic_electric', 'album_name', 'artist_name',
      'audio_format', 'boost', 'date_between', 'duration_between',
      'featured', 'format', 'full_count', 'gender', 'group_by',
      'image_size', 'name', 'name_search', 'order_by', 'page',
      'page_size', 'search', 'speed', 'vocal_instrumental',
      'x_artist'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('acoustic_electric')
      .isIn(['acoustic', 'electric'])
      .withMessage('Expects electric or electric'),
    query('audio_format')
      .isIn(['mp31', 'mp32', 'ogg', 'flac'])
      .withMessage('Expects mp31, mp32, ogg or flac'),
    query('boost')
      .isIn([
        'buzzrate', 'downloads_week', 'downloads_month',
        'downloads_month', 'downloads_total', 'listens_week',
        'listens_month', 'listens_total', 'popularity_week',
        'popularity_month', 'popularity_total'
      ])
      .withMessage('Invalid value passed. See docs.'),
    query('date_between')
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd'),
    query('duration_between')
      .matches(/^([0-9]+)_([0-9]+)$/)
      .withMessage('Expects format: from_to'),
    query(['featured', 'full_count'])
      .isBoolean({ strict: true })
      .withMessage('Expects true/faluse'),
    query('format')
      .isIn(['json', 'jsonpretty'])
      .withMessage('Expects json or jsonpretty'),
    query('gender')
      .isIn(['male', 'female'])
      .withMessage('Expect male or female'),
    query('group_by')
      .isIn(['artist_id', 'album_id'])
      .withMessage('Expects album_id or artist_id'),
    query('image_size')
      .isIn([
        20, 35, 50, 55, 60, 65, 70, 75, 85,
        100, 130, 150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
    query('order_by')
      .isIn([
        'relevance', 'buzzrate', 'downloads_week',
        'downloads_month', 'downloads_total', 'listens_week',
        'listens_month', 'listens_total', 'popularity_week',
        'popularity_month', 'popularity_total', 'name',
        'album_name', 'artist_name', 'releasedate', 'duration',
        'id'
      ])
      .withMessage('Invalid  order_by. See docs at /docs'),
    query(['page', 'page_size'])
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0'),
    query('speed')
      .isIn([
        'high', 'low', 'medium',
        'veryhigh', 'verylow'
      ])
      .withMessage('Invalid speed. See docs at /docs'),
    query('vocal_instrumental')
      .isIn(['vocal', 'instrumental'])
      .withMessage('Expects vocal or instrumental'),
  ],
  getTracks
);

export default router;
