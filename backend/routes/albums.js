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
 *         schema:
 *           $ref: '#/components/schemas/format'
 *       - in: query
 *         name: page
 *         schema:
 *           $ref: '#/components/schemas/page'
 *       - in: query
 *         name: page_size
 *         schema:
 *           $ref: '#/components/schemas/page_size'
 *       - in: query
 *         name: full_count
 *         schema:
 *           $ref: '#/components/schemas/results_full_count'
 *       - in: query
 *         name: id
 *         schema:
 *           $ref: '#/components/schemas/AlbumIds'
 *       - in: query
 *         name: name
 *         description: An album name
 *         schema:
 *           type: string
 *       - in: query
 *         name: artist_id
 *         schema:
 *           $ref: '#/components/schemas/ArtistIds'
 *       - in: query
 *         name: artist_name
 *         description: An artist name
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_between
 *         schema:
 *           $ref: '#/components/schemas/date_between'
 *       - in: query
 *         name: image_size
 *         schema:
 *           $ref: '#/components/schemas/image_size'
 *       - in: query
 *         name: audio_format
 *         schema:
 *           $ref: '#/components/schemas/audio_format'
 *     responses:
 *       200:
 *         description: fetching is successful
 */
router.get(
  ['/'],
  [
    query('page_size')
      .trim()
      .default(`${MIN_PAGE_SIZE}`)
      .isInt({min: MIN_PAGE_SIZE, max: MAX_PAGE_SIZE})
      .withMessage(`Expects an integer from ${MIN_PAGE_SIZE}`
                  + ` to ${MAX_PAGE_SIZE}`)
      .escape(),
    query('page')
      .default('1')
      .trim()
      .isInt({ min: 1, max: 200 })
      .withMessage('Expects an integer > 0')
      .escape(),
  ],
  getAlbums
);
router.get('/download', [], downloadAlbums);
router.get('/tracks', [], getAlbumsTracks);

export default router;
