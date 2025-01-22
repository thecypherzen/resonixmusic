import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  getArtists,
  getArtistsAlbums,
  getArtistsInfo,
  getArtistsTracks,
} from '../controllers/index.js';
import {
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '../defaults/index.js';

const router = Router();
router.use(json());

/**
 * @openapi
 * /artists/albums:
 *   get:
 *     tags:
 *       - Get Artists Albums
 *     summmary: Get tracks by one or more artists
 *     description: |
 *       By default, tracks returned are sorted in descending order
 *       of weekly popularity of the artist - using the parameter
 *       `popularity_week_desc`. Order can be changed by passing
 *       a different value for the `order_by` parameter.
 *     parameters:
 *       - in: query
 *         name: album_datebetween
 *         description: |
 *           Dates between which the artist(s)'s album is
 *           created. Format is same as `date_between` parameter.
 *       - in: query
 *         name: album_id
 *         description: |
 *           One or more album IDs. Use if you want tracks by an
 *           artist in particular album (or albums). Useful when, for
 *           instance a user clicks play on a user's album.
 *         schema:
 *           $ref: '#/components/schemas/AlbumIds'
 *         example: audio_format=flac
 *       - in: query
 *         name: album_name
 *         description: An album's name belonging to the artist
 *         schema:
 *           type: string
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
 *           database. Useful for pagination purposes. Use only when
 *           is really necessary due to it's performance issues.
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: has_image
 *         description: |
 *           A filter that selects only artist tracks with an image.
 *           Default value is `true`.
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: id
 *         description: One or more track IDs.
 *         schema:
 *           $ref: '#/components/schemas/TrackIds'
 *       - in: query
 *         name: image_size
 *         description: |
 *           The size of the cover of the returned resource.
 *           A size of n returns the 'nxn-sized' cover image.
 *         schema:
 *           $ref: '#/components/schemas/image_size'
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
 *           is ascending. Supported values are: `album_id`,
 *           `album_name`, `album_releasedate`, `id`, `joindate`,
 *           `name`, `popularity_month`, `popularity_total`,
 *           `popularity_week`.
 *         schema:
 *           type: string
 *           enum:
 *             - album_id
 *             - album_name
 *             - album_releasedate
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
  '/albums',
  [
    query(['album_datebetween', 'date_between'])
      .optional()
      .trim()
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd'),
    query(['album_id', 'id'])
      .optional()
      .notEmpty()
      .trim()
      .withMessage('Value cannot be empty')
      .escape(),
    query(['album_id.*', 'id.*'])
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query(['album_name', 'name', 'name_search'])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
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
    query('image_size')
      .optional()
      .trim()
      .isIn([
        20, 35, 50, 55, 60, 65, 70, 75, 85,
        100, 130, 150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
    query('order_by')
      .default('popularity_week_desc')
      .trim()
      .isIn([
        'album_id', 'album_id_asc', 'album_id_desc',
        'album_name', 'album_name_asc', 'album_name_desc',
        'album_releasedate', 'album_releasedate_asc',
        'album_releasedate_desc', 'id', 'id_asc',
        'id_desc', 'joindate', 'joindate_asc',
        'joindate_desc', 'name', 'name_asc', 'name_desc',
        'popularity_month', 'popularity_month_asc',
        'popularity_month_desc', 'popularity_total',
        'popularity_total_asc', 'popularity_total_desc',
        'popularity_week', 'popularity_week_asc',
        'popularity_week_desc'
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
    query('track_type.*')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn(['albumtrack', 'single'])
      .withMessage('Expects albumtrack or single')
      .escape(),
  ],
  getArtistsAlbums
);


/**
 * @openapi
 * /artists/info:
 *   get:
 *     tags:
 *       - Get Artists Music Info
 *     summmary: |
 *       Get the tags list of each artist and its
 *       description (html) if exists.
 *     descriptioin: |
 *       It also offers the possibility
 *       filter albums by tags (only one for the moment)
 *       through the parameter 'tag'. By default, results returned
 *       are sorted in descending order of weekly popularity of
 *       the artist - using the parameter `popularity_week_desc`.
 *       Order can be changed by passing a different value for
 *       the `order_by` parameter.
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
 *           database. Useful for pagination purposes. Use only when
 *           is really necessary due to it's performance issues.
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: has_image
 *         description: |
 *           A filter that selects only artist tracks with an image.
 *           Default value is `true`.
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: id
 *         description: One or more track IDs.
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
 *       - in: query
 *         name: tag
 *         description: |
 *           Tag to search an artist by. Except another sort order
 *           is specified through the `order_by` tag, results are
 *           in order of relevance.
 */
router.use(
  '/info',
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
      .notEmpty()
      .trim()
      .withMessage('Value cannot be empty')
      .escape(),
    query(['name', 'name_search', 'tag'])
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
        'popularity_week_desc'
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
  getArtistsInfo
);

/**
 * @openapi
 * /artists/tracks:
 *   get:
 *     tags:
 *       - Get Artists Tracks
 *     summmary: Get tracks by one or more artists
 *     description: |
 *       By default, tracks returned are sorted in descending order
 *       of weekly popularity of the artist - using the parameter
 *       `popularity_week_desc`. Order can be changed by passing
 *       a different value for the `order_by` parameter.
 *     parameters:
 *       - in: query
 *         name: album_datebetween
 *         description: |
 *           Dates between which the artist(s)'s album is
 *           created. Format is same as `date_between` parameter.
 *       - in: query
 *         name: album_id
 *         description: |
 *           One or more album IDs. Use if you want tracks by an
 *           artist in particular album (or albums). Useful when, for
 *           instance a user clicks play on a user's album.
 *         schema:
 *           $ref: '#/components/schemas/AlbumIds'
 *       - in: query
 *         name: album_name
 *         description: An album name. An album created by the artist.
 *         schema:
 *           type: string
 *       - in: query
 *         name: audio_format
 *         description: |
 *           The audio format you wish to use on the `fileurl`
 *           returned field - that is the format of the track
 *           that would be accessed via the `fileurl` field.
 *           Supported values are `mp31`, `mp32`, `ogg` and `flac`
 *           Default is `mp32`.
 *         schema:
 *           $ref: '#/components/schemas/track_audio_format'
 *         example: audio_format=flac
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
 *           database. Useful for pagination purposes. Use only when
 *           is really necessary due to it's performance issues.
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: has_image
 *         description: |
 *           A filter that selects only artist tracks with an image.
 *           Default value is `true`.
 *         schema:
 *           type: boolean
 *           default: true
 *       - in: query
 *         name: id
 *         description: One or more track IDs.
 *         schema:
 *           $ref: '#/components/schemas/TrackIds'
 *       - in: query
 *         name: image_size
 *         description: |
 *           The size of the cover of the returned resource.
 *           A size of n returns the 'nxn-sized' cover image.
 *         schema:
 *           $ref: '#/components/schemas/image_size'
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
 *           `popularity_week`, `track_id`, `track_name`,
 *           `track_releasedate`.
 *         schema:
 *           type: string
 *           enum:
 *             - id
 *             - joindate
 *             - name
 *             - popularity_month
 *             - popularity_total
 *             - popularity_week
 *             - track_id
 *             - track_name
 *             - track_releasedate
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
 *       - in: query
 *         name: track_id
 *         description: One or more track id
 *         schema:
 *           $ref: #/components/schemas/TrackIds
 *       - in: query
 *         name: track_name
 *         description: Name of track to fetch
 *         schema:
 *           type: string
 *       - in: query
 *         name: track_type
 *         description:
 */
router.use(
  '/tracks',
  [
    query(['album_datebetween', 'date_between'])
      .optional()
      .trim()
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      )
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd'),
    query(['album_id', 'id', 'track_id', 'track_type'])
      .optional()
      .notEmpty()
      .trim()
      .withMessage('Value cannot be empty')
      .escape(),
    query(['album_id.*', 'id.*', 'track_id.*'])
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query(['album_name', 'name', 'name_search', 'track_name'])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('audio_format')
     .optional()
     .trim()
     .isIn(['mp31', 'mp32', 'ogg', 'flac'])
     .withMessage('Expects mp31, mp32, ogg or flac'),
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
    query('image_size')
      .optional()
      .trim()
      .isIn([
        20, 35, 50, 55, 60, 65, 70, 75, 85,
        100, 130, 150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs at /docs'),
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
        'popularity_week_desc', 'track_id', 'track_id_asc',
        'track_id_desc', 'track_name', 'track_name_asc',
        'track_name_desc', 'track_releasedate',
        'track_releasedate_asc', 'track_releasedate_desc'
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
    query('track_type.*')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn(['albumtrack', 'single'])
      .withMessage('Expects albumtrack or single')
      .escape(),
  ],
  getArtistsTracks
);

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
