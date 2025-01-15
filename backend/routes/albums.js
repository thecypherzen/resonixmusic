import { Router, json } from 'express';
import { param, query } from 'express-validator';
import {
  downloadAlbums,
  getAlbums,
  getAlbumsTracks,
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
 * /albums:
 *   get:
 *     tags:
 *       - Albums
 *     summary: Gets a set of albums or a single album.
 *     description: |
 *       Albums can be fetched based on their ids or as they are in
 *       the database. If album_id array, which is an array of one or
 *       more album ids, is provided, only those albums are returned.
 *       The size of returned results can be modified with page,
 *       page_size and full_count query parameters.
 *     operationId: getAlbum
 *     parameters:
 *       - in: query
 *         name: format
 *         description: The way to format the response data body
 *         schema:
 *           $ref: '#/components/schemas/format'
 *       - in: query
 *         name: page
 *         description: The page number to return
 *         schema:
 *           $ref: '#/components/schemas/page'
 *       - in: query
 *         name: page_size
 *         description: The number of items in a single result list
 *         schema:
 *           $ref: '#/components/schemas/page_size'
 *       - in: query
 *         name: order_by
 *         description: |
 *           Sets the field by which to order results. Can also
 *           specify if ascending or descending by adding _asc or
 *           _desc respectively to the order value. The default is
 *           ascending order. When choosing an order field, it should
 *           be a field in  the object.
 *         schema:
 *           $ref: '#/components/schemas/order_by'
 *         examples:
 *           example1:
 *             summary: using default asc order
 *             value: order=popularity_month
 *           example2:
 *             summary: explicitly specifying ascending order
 *             value: order=popularity_month_asc
 *           example3:
 *             summary: explicitly specifying descending order
 *             value: order=popularity_month_desc
 *       - in: query
 *         name: full_count
 *         description: |
 *           Total results in database if no page_size or page
 *           parameters passed in.
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: id
 *         description: A list of one or more album IDs
 *         schema:
 *           $ref: '#/components/schemas/AlbumIds'
 *       - in: query
 *         name: name
 *         description: An album name
 *         schema:
 *           type: string
 *       - in: query
 *         name: artist_id
 *         description: ID of the artist who created the album
 *         schema:
 *           $ref: '#/components/schemas/ArtistIds'
 *         example: '104336'
 *       - in: query
 *         name: artist_name
 *         description: Name of the artist who owns the album
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_between
 *         description: |
 *           A filter of results based on a starting and
 *           ending date, separated by an underscore(_). Both dates
 *           must be in the format 'yyyy-mm-dd'
 *         schema:
 *           $ref: '#/components/schemas/date_between'
 *       - in: query
 *         name: image_size
 *         description: |
 *           The size of the cover of the returned resource.
 *           A size of n returns the 'nxn-sized' cover image.
 *         schema:
 *           $ref: '#/components/schemas/image_size'
 *       - in: query
 *         name: audio_format
 *         description: |
 *           The audio format you wish to use on the `fileurl`
 *           returned field - that is the format of the returned file.
 *           Currently, only mp32 is supported.
 *         schema:
 *           $ref: '#/components/schemas/audio_format'
 *     responses:
 *       200:
 *         description: results were found based on passed parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseData'
 *       404:
 *         description: no results were found based on parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: failed
 *                 code: 404
 *                 error_message: some message
 *                 'x-took': xyms
 *       400:
 *         description: some error in request parameters or path
 */
router.get(
  ['/'],
  [
    query('page_size')
      .trim()
      .default(`${MIN_PAGE_SIZE}`)
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({min: MIN_PAGE_SIZE, max: MAX_PAGE_SIZE})
      .withMessage(`Expects an integer from ${MIN_PAGE_SIZE}`
                  + ` to ${MAX_PAGE_SIZE}`)
      .escape(),
    query('page')
      .default('1')
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isInt({ min: 1 })
      .withMessage('Expects an integer > 0')
      .escape(),
    query('format')
      .optional()
      .trim()
      .notEmpty()
      .isIn(['xml', 'json', 'jsonpretty'])
      .withMessage('Expects: xml, json or jsonpretty')
      .escape(),
    query(['artist_id', 'id', 'order_by'])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isArray()
      .withMessage('Expects an array')
      .escape(),
    query('order_by.*')
      .trim()
      .notEmpty()
      .withMessage('Values of order_by cannot be empty')
      .isIn([
        'name', 'name_asc', 'name_desc',
        'id', 'id_asc', 'id_desc',
        'releasedate', 'releasedate_asc', 'releasedate_desc',
        'artist_id', 'artist_id_asc', 'artist_id_desc',
        'artist_name', 'artist_name_asc', 'artist_name_desc',
        'popularity_total', 'popularity_total_asc',
        'popularity_total_desc', 'popularity_month',
        'popularity_month_asc', 'popularity_month_desc',
        'popularity_week', 'popularity_week_asc',
        'popularity_week_desc'
      ])
      .withMessage('Invalid value of order_by. Check docs and fix.')
      .escape(),
    query('full_count')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .isBoolean()
      .withMessage('Expects boolean: true or false')
      .escape(),
    query('id.*')
      .trim()
      .notEmpty()
      .withMessage('Values of id cannot be empty')
      .escape(),
    query('artist_id.*')
      .trim()
      .notEmpty()
      .withMessage('Values of artist_id cannot be empty')
      .escape(),
    query([
      'artist_name', 'audio_format', 'name',
      'date_between', 'image_size'
    ])
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Value cannot be empty')
      .escape(),
    query('date_between')
      .optional()
      .matches(
        /^([0-9]{4})-([0-9]{2})-([0-9]{2})_([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
      .withMessage('Expects format: yyyy-mm-dd_yyy-mm-dd')
      .escape(),
    query('image_size')
      .optional()
      .isInt()
      .withMessage('Expects an integer')
      .isIn([
        20, 35, 50, 55, 60, 65, 70, 75, 85,
        100, 130, 150, 200, 300, 400, 500, 600
      ])
      .withMessage('Invalid image_size. See docs on /docs route.')
      .escape(),
    query('audio_format')
      .optional()
      .matches('mp32')
      .withMessage('Only mp32 is supported'),
  ],
  getAlbums
);
router.get('/download', [], downloadAlbums);
router.get('/tracks', [], getAlbumsTracks);

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
})
export default router;
