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
    query('tags')
      .optional()
      .trim()
      .notEmpty()
      .isArray()
      .withMessage('Expects an array')
      .escape(),
  ],
  getTracks
);

export default router;
