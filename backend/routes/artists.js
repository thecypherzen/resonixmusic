import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  getArtists,
} from '../controllers/index.js';
import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '../defaults/index.js';

const router = Router();
router.use(json());

router.use(
  '/',
  [
    query('date_between')
      .optional()
      .trim()
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd'),
    query('format')
      .optional()
      .trim()
      .isIn(['json', 'jsonpretty'])
      .withMessage('Expects json or jsonpretty'),
    query('full_count')
    .optional()
    .trim()
    .toBoolean()
    .isBoolean({ strict: true })
    .withMessage('Expects true/false'),
    query('has_image')
      .default('true')
      .trim()
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage('Expects true/false')
      .escape(),
    query('id')
      .optional()
      .trim()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('id.*')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query(['name', 'name_search'])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('order_by')
      .default('popularity_week_desc')
      .trim()
      .isIn([
        'id', 'id_asc', 'id_desc', 'joindate', 'joindate_asc',
        'joindate_desc', 'name', 'name_asc', 'name_desc',
        'popularity_month', 'popularity_month_asc',
        'popularity_month_desc', 'popularity_total',
        'popularity_total_asc', 'popularity_total_desc',
        'popularity_week', 'popularity_week_asc',
        'popularity_week_desc',
      ])
      .withMessage('Invalid order_by. See docs at /docs'),
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
  ],
  getArtists
);

export default router;
