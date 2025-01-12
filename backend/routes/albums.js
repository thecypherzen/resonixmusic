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
 *     description: fetches albums
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
      .isInt({ gt: 0 })
      .withMessage('Expects an integer > 0')
      .escape(),
  ],
  getAlbums
);
router.get('/download', [], downloadAlbums);
router.get('/tracks', [], getAlbumsTracks);

export default router;
