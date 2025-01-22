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
/**
 * @openapi
 *   /tracks:
 *     get:
 *       tags:
 *         - Get Tracks
 *       summary: Get a set of tracks
 *       description: |
 *         By default, tracks the returned tracks in the `results`
 *         field of the response data are those trending that week.
 *         This is determined by the `boost` query parameter. To
 *         change this behaviour, refer to the description of the
 *         `boost` parameter below.
 *       operationId: getTracks
 *       parameters:
 *         - in: query
 *           name: acoustic_electric
 *           description: |
 *             Filter tracks by either electric or acoustic. Not all
 *             all tracks have this field set so if provided, only
 *             tracks that have their `acousticelectric` field set to
 *             the value passed will be returned.
 *           schema:
 *             $ref: '#/components/schemas/acoustic_electric'
 *           examples:
 *             example1:
 *               summary: electric tracks
 *               value: acoustic_electric=electric
 *             example2:
 *               summary: acoustic tracks
 *               value: acoustic_electric=acoustic
 *         - in: query
 *           name: album_id
 *           description: |
 *             One or more album IDs. Use if you want to get tracks of
 *             a particular album(s). Useful when, for instance a user
 *             clicks to play an album in the frontend.
 *           schema:
 *             $ref: '#/components/schemas/AlbumIds'
 *           examples:
 *             example1:
 *               summary: one album ID
 *               value: album_id[]=130370
 *             example2:
 *               summary: multiple album IDs
 *               value: album_id=130370&abum_id=1203993
 *         - in: query
 *           name: album_name
 *           description: |
 *             The name of the album to return its tracks. Only one
 *             value can be specified
 *           schema:
 *             $ref: '#/components/schemas/album_name'
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
 *           name: artist_name
 *           description: |
 *             The name of the artist to return their tracks. Only one
 *             value can be specified
 *           schema:
 *             $ref: '#/components/schemas/artist_name'
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
 *           example: audio_format=flac
 *         - in: query
 *           name: boost
 *           description: |
 *             Sets the order of the returned tracks by the passed
 *             value. This is is different from the `order_by`
 *             parameter in that `boost` only sorts the results
 *             of the particular page and not all rows in the
 *             database.
 *           schema:
 *              $ref: '#/components/schemas/boost'
 *         - in: query
 *           name: date_between
 *           description: |
 *             A filter of results based on a starting and
 *             ending date, separated by an underscore(_). Both dates
 *             must be in the format 'yyyy-mm-dd'
 *           schema:
 *             $ref: '#/components/schemas/date_between'
 *         - in: query
 *           name: duration_between
 *           description: |
 *             Track duration between values (seconds). Filters tracks
 *             whose duration fall within the interval. The 'from'
 *             and 'to' parts are mandatory and must be separated by
 *             an underscore(_). Both times must be integers
 *           schema:
 *             $ref: '#/components/schemas/duration_between'
 *           example: duration_between=120_280
 *         - in: query
 *           name: featured
 *           description: Select only featured tracks.
 *           schema:
 *             $ref: '#/components/schemas/featured'
 *         - in: query
 *           name: format
 *           description: The way to format the response data body
 *           schema:
 *             $ref: '#/components/schemas/format'
 *         - in: query
 *           name: full_count
 *           description: |
 *             Sets the 'results_fullcount' value in the results data
 *             'headers' to the total number results(tracks) in the
 *             database. Usefulf for pagination purposes.
 *           schema:
 *             $ref: '#/components/schemas/results_full_count'
 *         - in: query
 *           name: gender
 *           description: |
 *             Gender of the artist if the track is of type `vocal`.
 *             Supported values are `male` and `female`.
 *           schema:
 *             $ref: '#/components/schemas/gender'
 *         - in: query
 *           name: group_by
 *           description: |
 *             A results aggregator. Groups tracks by `artist_id`
 *             or `album_id`. If you add groupby=artist_id to
 *             your get request, just one track per artist will be
 *             returned; such track is the first one that would be
 *             find on the results list if there was no grouping. Use
 *             only when using the `order_by` parameter.
 *           schema:
 *             $ref: '#/components/schemas/tracks_group_by'
 *         - in: query
 *           name: id
 *           description: One or more track IDs.
 *           schema:
 *             $ref: '#/components/schemas/TrackIds'
 *         - in: query
 *           name: image_size
 *           description: |
 *             The size of the cover of the returned resource.
 *             A size of n returns the 'nxn-sized' cover image.
 *           schema:
 *             $ref: '#/components/schemas/image_size'
 *         - in: query
 *           name: include
 *           description: |
 *             Fields to include in results data that are not included
 *             by default. So far, only `licenses` are not included.
 *           schema:
 *             $ref: '#/components/schemas/include'
 *         - in: query
 *           name: lang
 *           description: |
 *             Language of track. Supported values are of the form
 *             `en`, `fr`, etc. If specified, the number of tracks
 *             returned per page may be less than the value in the
 *             `results_count` as the filteration is done after
 *             the page has been populated.
 *           schema:
 *             $ref: '#/components/schemas/lang'
 *         - in: query
 *           name: name
 *           description: A track's name
 *           schema:
 *             type: string
 *         - in: query
 *           name: name_search
 *           description: |
 *             Search for tracks that contain all or part of the
 *             passed value in their name. That is a match against
 *             name=*value*
 *           schema:
 *             type: string
 *         - in: query
 *           name: order_by
 *           description: |
 *             Sort results by a given field. Can also specify if
 *             order should be ascending or descending by adding
 *             `_asc` or `_desc` resppectively. The default order
 *             is ascending. For supported values, see schema
 *             `tracks_order_by` below.
 *           schema:
 *             $ref: '#/components/schemas/tracks_order_by'
 *         - in: query
 *           name: page
 *           description: The page number to return
 *           schema:
 *             $ref: '#/components/schemas/page'
 *         - in: query
 *           name: page_size
 *           description: The number of tracks in a single result list
 *           schema:
 *             $ref: '#/components/schemas/page_size'
 *         - in: query
 *           name: search
 *           description: |
 *             Search term to use in getting tracks. It operates
 *             considering the track, artist and album name as well
 *             as tags like genres, instruments, etc, and similar
 *             similar artists.
 *           schema:
 *             type: string
 *         - in: query
 *           name: speed
 *           description: |
 *             A list of one or more track speeds. Returns only
 *             tracks with the specified speeds. Accepted values are
 *             `high` `low`, 'medium', 'veryhigh' and 'verylow'.
 *           schema:
 *             $ref: '#/components/schemas/TrackSpeeds'
 *         - in: query
 *           name: tags
 *           description: |
 *             A list of tags to Limit results by. Only tracks that
 *             contain the tag(s), like `pop`, are returned.
 *           schema:
 *             $ref: '#/components/schemas/tags'
 *         - in: query
 *           name: type
 *           description: |
 *             A list of track types. Selects only tracks of specified
 *             type. Supported values at the moment are `albumtrack`,
 *             `single`. By default, `albumtrack`s are returned.
 *           schema:
 *             $ref: '#/components/schemas/TrackTypes'
 *         - in: query
 *           name: vocal_instrumental
 *           description: |
 *             Filter tracks by value of their `vocalinstrumental`
 *             musicinfo field value. Use if you want to get only
 *             vocal tracks or only instrumentals.
 *           schema:
 *             $ref: '#/components/schemas/vocal_instrumental'
 *         - in: query
 *           name: x_artist
 *           description: |
 *             Select tracks that are most similar to those by the
 *             artist passed.
 *           example: x_artist=madonna
 *           schema:
 *             type: string
 */
router.get(
  '/',
  [
    query([
      'album_id', 'artist_id', 'fuzzy_tags',
      'id', 'lang', 'speed', 'tags', 'type',
    ])
      .optional()
      .trim()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query([
      'album_id.*', 'artist_id.*', 'fuzzy_tags.*',
      'id.*', 'lang.*', 'tags.*',
    ])
      .notEmpty()
      .trim()
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
      'name','name_search', 'search', 'x_artist'
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
      .toBoolean()
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
    query('include')
      .optional()
      .trim()
      .matches('licenses')
      .withMessage('Expects licenses as value')
      .escape(),
    query('order_by')
      .optional()
      .trim()
      .isIn([
        'relevance', 'relevance_asc', 'relevance_desc',
        'buzzrate', 'buzzrate_asc', 'buzzrate_desc',
        'downloads_week', 'downloads_week_asc',
        'downloads_week_desc', 'downloads_month',
        'downloads_month_asc', 'downloads_month_desc',
        'downloads_total', 'downloads_total_asc',
        'downloads_total_desc','listens_week', 'listens_week_asc',
        'listens_week_desc', 'listens_month', 'listens_month_asc',
        'listens_month_desc', 'listens_total', 'listens_total_asc',
        'listens_total_desc', 'popularity_week',
        'popularity_week_asc', 'popularity_week_desc',
        'popularity_month', 'popularity_month_asc',
        'popularity_month_desc', 'popularity_total',
        'popularity_total_asc', 'popularity_total_desc', 'name',
        'name_asc', 'name_desc', 'album_name', 'album_name_asc',
        'album_name_desc', 'artist_name', 'artist_name_asc',
        'artist_name_desc', 'releasedate', 'releasedate_asc',
        'releasedate_desc', 'duration', 'duration_asc',
        'duration_desc', 'id', 'id_asc', 'id_desc'
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
    query('speed.*')
      .notEmpty()
      .withMessage('Value cannot be empty')
      .trim()
      .isIn([
        'high', 'low', 'medium',
        'veryhigh', 'verylow'
      ])
      .withMessage('Invalid speed. See docs at /docs'),
    query('type.*')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isIn(['albumtrack', 'single'])
      .withMessage('Expects albumtrack or single')
      .escape(),
    query('vocal_instrumental')
      .optional()
      .trim()
      .isIn(['vocal', 'instrumental'])
      .withMessage('Expects vocal or instrumental'),
  ],
  getTracks
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
