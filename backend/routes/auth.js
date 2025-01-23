import { Router, json } from 'express';
import { query } from 'express-validator';
import { cookieParser } from 'cookie-parser';
import {
  authAuthorize,
  authGrant,
} from '../controllers/index.js';

const router = Router();
router.use(json());
router.use(cookieParser());

router.use('/authorize', authAuthorize);

router.use('/login', (req, res) => res.redirect('authorize'));

router.use('/logout', (req, res) => null);

router.use('/refresh', (req, res) => {
  console.log('refreshing');
  return res.send({ route: 'refresh auth token' });
});

router.use(
  '/verify',
  [
    query(['access_token', 'code', 'state'])
      .isString()
      .withMessage('Invalid parameter'),
  ],
  authGrant
);


export default router;
