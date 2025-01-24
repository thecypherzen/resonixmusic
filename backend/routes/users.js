import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  getUsers,
  getUsersAlbums,
  getUsersArtists,
  getUsersTracks,
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
 *   /users/albums:
 *     get:
 *       tags:
 *         - Get Users Albums
 *       summary: Get albums of one or more users
 *       description: |
 *         Requires at least one of the following parameters
 *         `id`, `access_token`, and `name`.
 *       operationId: getUsers
 *       parameters:
 *         - in: query
 *           name: album_id
 *           description: One or more album IDs
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: access_token
 *           description: |
 *             A valid access token corresponding to the Jamendo user
 *             you want to get data for.
 *           schema:
 *             type: string
 *         - in: query
 *           name: album_imagesize
 *           description: The cover size of album in pixels
 *           schema:
 *             $ref: '#/components/schemas/image_size'
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
 *           description: One or more user IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: image_size
 *           description: |
 *             The size of the avatar of the user in pixels
 *           schema:
 *             $ref: '#/components/schemas/user_image_size'
 *         - in: query
 *           name: name
 *           description: The User's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by `createdate`. Can also specify
 *             if order should be ascending or descending by
 *             adding `_asc` or `_desc` resppectively. The default
 *             order is `updatedate_desc`.
 *           schema:
 *             type: string
 *             enum:
 *               - createdate
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
 */
router.get(
  '/albums',
  [
    query([
      'access_token', 'name'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
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
    query('album_id', 'id')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('album_id.*', 'id.*')
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('album_imagesize')
      .default('500')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([
        25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130,
        150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
    query('image_size')
      .default('100')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([ 30, 50, 100 ])
      .withMessage('Invalid image_size. Expects 30, 50 or 100'),
    query('order_by')
      .optional()
      .default('updatedate_desc')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn([
        'updatedate', 'updatedate_asc', 'updatedate_desc'
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
  getUsersAlbums
);

/**
 * @openapi
 *   /users/artists:
 *     get:
 *       tags:
 *         - Get Users Artists
 *       summary: Get one or more user's favorite artists.
 *       description: |
 *         Requires at least one of the following parameters
 *         `id`, `access_token`, and `name`.
 *       operationId: getUsersArtists
 *       parameters:
 *         - in: query
 *           name: access_token
 *           description: |
 *             A valid access token corresponding to the Jamendo user
 *             you want to get data for.
 *           schema:
 *             type: string
 *         - in: query
 *           name: artist_id
 *           description: A list of one or more artist IDs.
 *           schema:
 *             $ref: '#/components/schemas/ArtistIds'
 *           examples:
 *             example1:
 *               summary: one artist_id
 *               value: artist_id[]=439311
 *             example2:
 *               summary: multiple artist_ids
 *               value: artist_id=439311&artist_id=451022
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
 *           description: One or more user IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: image_size
 *           description: |
 *             The size of the cover of the returned resource.
 *             A size of n returns the 'nxn-sized' cover image.
 *           schema:
 *             $ref: '#/components/schemas/user_image_size'
 *         - in: query
 *           name: name
 *           description: The User's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by a given field. Can also specify
 *             if order should be ascending or descending by
 *             adding `_asc` or `_desc` resppectively. The default
 *             order is ascending. Supported values are
 *             `updatedate`. By default, they are sorted
 *             by `updatedate_desc`.
 *           schema:
 *             type: string
 *             enum:
 *               - updatedate
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
 */
router.get(
  '/artists',
  [
    query([
      'access_token', 'name'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
     query(['artist_id', 'id'])
      .optional()
      .trim()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query(['artist_id.*', 'id.*'])
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
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
    query('id')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('id.*')
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('image_size')
      .default('100')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([ 30, 50, 100 ])
      .withMessage('Invalid image_size. Expects 30, 50 or 100'),
    query('order_by')
      .optional()
      .default('updatedate_desc')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn([
        'updatedate', 'updatedate_asc', 'updatedate_desc'
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
  getUsersArtists
);

/**
 * @openapi
 *   /users/tracks:
 *     get:
 *       tags:
 *         - Get Users Tracks
 *       summary: Get the tracks of one or more users
 *       description: |
 *         Requires at least one of the following parameters
 *         `id`, `access_token`.
 *       operationId: getUsersTracks
 *       parameters:
 *         - in: query
 *           name: album_id
 *           description: One or more album IDs
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: access_token
 *           description: |
 *             A valid access token corresponding to the Jamendo user
 *             you want to get data for.
 *           schema:
 *             type: string
 *         - in: query
 *           name: album_imagesize
 *           description: The cover size of album in pixels
 *           schema:
 *             $ref: '#/components/schemas/image_size'
 *         - in: query
 *           name: artist_id
 *           description: |
 *             A list of one or more artist IDs. Results would only
 *             include tracks produced by these artists.
 *           schema:
 *             $ref: '#/components/schemas/ArtistIds'
 *           examples:
 *             example1:
 *               summary: one artist_id
 *               value: artist_id[]=439311
 *             example2:
 *               summary: multiple artist_ids
 *               value: artist_id=439311&artist_id=451022
 *         - in: query
 *           name: audio_format
 *           description: |
 *             The audio format you wish to use on the `fileurl`
 *             returned field - that is the format of the track
 *             that would be accessed via the `fileurl` field.
 *             Supported values are `mp31`, `mp32`, `ogg` and `flac`.
 *             Default is `mp32`.
 *           schema:
 *             $ref: '#/components/schemas/track_audio_format'
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
 *           description: One or more user IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: image_size
 *           description: |
 *             The size of the avatar of the user in pixels
 *           schema:
 *             $ref: '#/components/schemas/user_image_size'
 *         - in: query
 *           name: name
 *           description: The User's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by fields. Can also specify
 *             if order should be ascending or descending by
 *             adding `_asc` or `_desc` resppectively. The default
 *             order is `updatedate_desc`. Supported values are
 *             `updatedate`, and `rating`
 *           schema:
 *             type: string
 *             enum:
 *               - createdate
 *               - rating
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
 *           name: relation
 *           description: |
 *             Choose tracks a user has liked, reviewed or favorited.
 *             By default, `like` and `favorite` tracks are
 *             returned. You can also pass in `review`.
 *           schema:
 *             $ref: '#/components/schemas/user_relation'
 *         - in: query
 *           name: track_id
 *           description: One or more track IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: track_type
 *           description: |
 *             A list of track types. Selects only tracks of specified
 *             type. Supported values at the moment are `albumtrack`,
 *             `single`. By default, `albumtrack`s are returned.
 *           schema:
 *             $ref: '#/components/schemas/TrackTypes'
 */
router.get(
  '/tracks',
  [
    query('access_token')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query([
      'album_id', 'artist_id', 'id',
      'track_id', 'track_type'
    ])
      .optional()
      .trim()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query([
      'album_id.*', 'artist_id.*',
      'id.*', 'track_id.*',
    ])
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('album_imagesize')
      .default('500')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([
        25, 35, 50, 55, 60, 65, 70, 75, 85, 100, 130,
        150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
    query('audio_format')
      .optional()
      .trim()
      .isIn(['mp31', 'mp32', 'ogg', 'flac'])
      .withMessage('Expects mp31, mp32, ogg or flac'),
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
    query('image_size')
      .default('100')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([ 30, 50, 100 ])
      .withMessage('Invalid image_size. Expects 30, 50 or 100'),
    query('order_by')
      .optional()
      .default('updatedate_desc')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn([
        'updatedate', 'updatedate_asc', 'updatedate_desc',
        'rating', 'rating_asc', 'rating_desc'
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
    query('relation')
      .customSanitizer((value) => value || ['favorite', 'like'])
      .notEmpty()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('relation.*')
      .notEmpty()
      .isIn(['favorite', 'like', 'review'])
      .withMessage('Expects favorite, like or review')
      .escape(),
    query('track_type.*')
      .notEmpty()
      .isIn(['albumtrack', 'single'])
      .withMessage('Expects albumtrack or single')
      .escape(),
  ],
  getUsersTracks
);

/**
 * @openapi
 *   /users:
 *     get:
 *       tags:
 *         - Get Users
 *       summary: Get information of a set of Users
 *       description: |
 *         Requires at least one of the following parameters
 *         `id`, `access_token`, and `name`.
 *       operationId: getUsers
 *       parameters:
 *         - in: query
 *           name: access_token
 *           description: |
 *             A valid access token corresponding to the Jamendo user
 *             you want to get data for.
 *           schema:
 *             type: string
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
 *           description: One or more user IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: image_size
 *           description: |
 *             The size of the cover of the returned resource.
 *             A size of n returns the 'nxn-sized' cover image.
 *           schema:
 *             $ref: '#/components/schemas/user_image_size'
 *         - in: query
 *           name: name
 *           description: The User's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by a given field. Can also specify
 *             if order should be ascending or descending by
 *             adding `_asc` or `_desc` resppectively. The default
 *             order is ascending. Supported values are
 *             `updatedate`. By default, they are sorted
 *             by `updatedate_desc`.
 *           schema:
 *             type: string
 *             enum:
 *               - updatedate
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
 */
router.get(
  '/',
  [
    query([
      'access_token', 'name'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
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
    query('id')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('id.*')
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('image_size')
      .default('100')
      .trim()
      .isInt()
      .withMessage('Expects an integer > 0')
      .isIn([ 30, 50, 100 ])
      .withMessage('Invalid image_size. Expects 30, 50 or 100'),
    query('order_by')
      .optional()
      .default('updatedate_desc')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn([
        'updatedate', 'updatedate_asc', 'updatedate_desc'
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
  getUsers
);

router.use((req, res) => {
  return res.status(404).send({
    headers: {
      status: 'failed',
      code: resCodes[22].code,
      error_message: resCodes[22].des,
      warning: '',
      'x-took': '0ms'
    }
  })
});

export default router;