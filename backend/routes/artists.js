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

/**
 * @openapi
 * /artists:
 *   get:
 *     tags:
 *       - Get Artists
 *     summmary: Get a set of playlists
 *     description: |
 *       By default, artists returned are sorted in descending order
 *       of weekly popularity using the value `popularity_week_desc`.
 *       Can be changed by passing a different value for the
 *       `order_by` parameter.
 *     parameters:
 *       - in: query
 *         name: date_between
 *         description: |
 *           A filter of artists by their join date. Consists of
 *           'from' and 'to' fields separated by a '_'. Each
 *           field must be in teh format 'yyyy-mm-dd'.
 *         example: date_between=2025-01-12_2019-01-10
 *         schema:
 *           $ref: '#/components/schemas/date_between'
 *       - in: query
 *         name: format
 *         description: The way to format the response data body
 *         schema:
 *           $ref: '#/components/schemas/format'
 *       - in: query
 *         name: full_count
 *         description: |
 *           Sets the 'results_fullcount' value in the results data
 *           'headers' to the total number results(tracks) in the
 *           database. Usefulf for pagination purposes. Use only when
 *           is really necessary due to it's performance issues.
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: has_image
 *         description: |
 *           A filter that selects only artists with an image.
 *           Default value is `true`.
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: id
 *         description: One or more artist IDs.
 *         schema:
 *           $ref: '#/components/schemas/TrackIds'
 *       - in: query
 *         name: name
 *         description: An artist's name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name_search
 *         description: |
 *           Search for artists that contain all or part of the
 *           passed value in their name. That is a match against
 *           `name=*value*`.
 *         schema:
 *           type: string
 *       - in: query
 *         name: order_by
 *         description: |
 *           Sort results by a given field. Can also specify if
 *           the order should be ascending or descending by adding
 *           `_asc` or `_desc` resppectively. The default order
 *           is ascending. Supported values are: `id`, `joindate`,
 *           `name`, `popularity_month`, `popularity_total`,
 *           `popularity_week`.
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - joindate
 *             - name
 *             - popularity_month
 *             - popularity_total
 *             - popularity_week
 *       - in: query
 *         name: page_size
 *         description: The number of tracks in a single result list
 *         schema:
 *           $ref: '#/components/schemas/page_size'
 *       - in: query
 *         name: page
 *         description: The page number to return
 *         schema:
 *            $ref: '#/components/schemas/page'
 */
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
