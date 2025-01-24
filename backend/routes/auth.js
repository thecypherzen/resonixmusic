import cookieParser  from 'cookie-parser';
import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  authAuthorize,
  authGrant,
  logOutUser,
  refreshAuth,
  verifiers,
} from '../controllers/index.js';
import {
  authManager
} from '../utils/index.js';

const router = Router();
router.use(json());
router.use(cookieParser());

router.use('/authorize', authAuthorize);

router.use('/login', async (req, res) => {
  const loggedOut = await verifiers.isLoggedOut(req);
  if (loggedOut) {
    return res.redirect('authorize')
  }
  const tokenExpired = await verifiers.tokenExpired(req);
  if (tokenExpired) {
    return res.redirect('refresh');
  }
  return authManager.sendData(req, res);
});

router.use('/logout', logOutUser);

router.use('/refresh', refreshAuth);

router.use(
  '/verify',
  [
    query(['access_token', 'code', 'state'])
      .isString()
      .withMessage('Invalid parameter'),
  ],
  authGrant
);

router.use('/denied', (req, res) => {
  const body = {
    headers: {
      status: 'failed',
      code: 401,
      error_message: req.message,
      warning: '',
      'x-took': '0ms',
    },
    results: [],
  };
  res.status(401).send(body);
})

export default router;
