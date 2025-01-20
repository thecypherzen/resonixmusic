import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  getPlaylists,
} from '../controllers/index.js';
import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  RESPONSE_CODES as resCodes
} from '../defaults/index.js';

const router = Router();
router.use(json());
/**
 * @openapi
 *   /playlists:
 *     get:
 *       tags:
 *         - Get Playlists
 *       summary: Get as set of playlists
 *       description: |
 *         A playlist is a dynamic collection of tracks. Only the
 *         user who created and owns it can modify/delete/publish/mask
 *         it at any time. This method let you select and filter
 *         playlists using query parameters. In the returned results,
 *         the `zip` field shows the url to get the playlist's tracks
 *         in a zip format (that is downloading it). The zip may
 *         contain less tracks than what the playlist actually
 *         contains, as an internal limit of about 100 is set on
 *         our sourcing server (Jamendo).
 *       operationId: getPlaylists
 *       parameters:
 *         - in: query
 *           name: access_token
 *           description: |
 *             A valid access token corresponding to the Jamendo user
 *             you want to get data for.
 *           schema:
 *             type: string
 *         - in: query
 *           name: audio_format
 *           description: |
 *             The audio format you wish to use on the `fileurl`
 *             returned field - that is the format of the track
 *             that would be accessed via the `fileurl` field.
 *             Only `mp32` is supported.
 *           schema:
 *             $ref: '#/components/schemas/album_audio_format'
 *         - in: query
 *           name: date_between
 *           description: |
 *             A filter of results based on a starting and
 *             ending date, separated by an underscore(_). Both
 *             dates must be in the format `yyyy-mm-dd`
 *           schema:
 *             $ref: '#/components/schemas/date_between'
 *         - in: query
 *           name: format
 *           description: |
 *             The way to format the response data body
 *           schema:
 *             $ref: '#/components/schemas/format'
 *         - in: query
 *           name: full_count
 *           description: |
 *             Sets the 'results_fullcount' value in the results
 *             data 'headers' to the total number results(tracks)
 *             in the database. Useful for pagination purposes.
 *           schema:
 *             $ref: '#/components/schemas/results_full_count'
 *         - in: query
 *           name: id
 *           description: One or more playlist IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: name
 *           description: A playlist's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: name_search
 *           description: |
 *             Search for playliss that contain all or part of the
 *             passed value in their name. That is a match against
 *             name=*value*
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by a given field. Can also specify
 *             if order should be ascending or descending by
 *             adding `_asc` or `_desc` resppectively. The default
 *             order is ascending. Supported values are
 *             `creationdate`, `id`, and `name`.
 *           schema:
 *             type: string
 *             enum:
 *               - creationdate
 *               - id
 *               - name
 *         - in: query
 *           name: page
 *           description: The page number to return
 *           schema:
 *             $ref: '#/components/schemas/page'
 *         - in: query
 *           name: page_size
 *           description: The number of playlists in a single
 *             result list
 *           schema:
 *             $ref: '#/components/schemas/page_size'
 *         - in: query
 *           name: user_id
 *           description: One or more user(author) ids.
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *             minItems: 1
 *         - in: query
 *           name: user_name
 *           description: name of the user who created playlist
 *           schema:
 *             type: string
 */
router.use(
  '/',
  [
    query([
      'access_token', 'name', 'name_search', 'user_name'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('audio_format')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .matches('mp32')
      .withMessage('Expects mp32')
      .escape(),
    query('date_between')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .escape(),
    query('format')
      .optional()
      .trim()
      .isIn(['json', 'jsonpretty'])
      .withMessage('Expects json or jsonpretty')
      .escape(),
    query('full_count')
      .optional()
      .trim()
      .toBoolean()
      .isBoolean({ strict: true })
      .withMessage('Expects true/false')
      .escape(),
    query(['id', 'user_id'])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query(['id.*', 'user_id.*'])
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('order_by')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn([
        'creationdate', 'creationdate_asc', 'creationdate_desc',
        'id', 'id_asc', 'id_desc', 'name', 'name_asc', 'name_desc',
      ])
      .escape(),
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
  getPlaylists
)

export default router;
