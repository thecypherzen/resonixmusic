import cookieParser  from 'cookie-parser';
import { Router, json } from 'express';
import { query } from 'express-validator';
import crypto from 'crypto';
import axios from 'axios';
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
  try {
    const loggedOut = await verifiers.isLoggedOut(req);
    if (loggedOut) {
      // Generate state for OAuth
      const state = crypto.randomBytes(32).toString('hex');
      req.session.oauth_state = state;

      const jamendoAuthUrl = 'https://api.jamendo.com/v3.0/oauth/authorize';
      const redirectUri = 'http://localhost:5173/auth/callback'; // Frontend callback URL
      
      const params = new URLSearchParams({
        client_id: process.env.JAMENDO_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        state: state
      });

      return res.redirect(`${jamendoAuthUrl}?${params.toString()}`);
    }

    const tokenExpired = await verifiers.tokenExpired(req);
    if (tokenExpired) {
      return res.redirect('refresh');
    }
    
    return authManager.sendData(req, res);
  } catch (error) {
    console.error('Login error:', error);
    return res.redirect('/auth/denied');
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      throw new Error('Missing required parameters');
    }

    if (state !== req.session.oauth_state) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token with Jamendo
    const tokenResponse = await axios.post('https://api.jamendo.com/v3.0/oauth/grant', {
      client_id: process.env.JAMENDO_CLIENT_ID,
      client_secret: process.env.JAMENDO_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:5173/auth/callback'
    });

    const authData = tokenResponse.data;

    // Store auth data in session
    req.session.auth = {
      accessToken: authData.access_token,
      refreshToken: authData.refresh_token,
      expiresAt: Date.now() + (authData.expires_in * 1000)
    };

    res.json({
      headers: {
        status: 'success',
        code: 0,
        error_message: '',
        warnings: '',
        'x-took': '0ms'
      },
      results: [authData]
    });
  } catch (error) {
    console.error('Verify failed:', error);
    res.status(400).json({
      headers: {
        status: 'error',
        code: 1,
        error_message: error.message,
        warnings: '',
        'x-took': '0ms'
      }
    });
  }
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
  authManager.verifyAuth
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

// to redirect users back to the frontend after login
router.get('/login', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.oauth_state = state;

  const jamendoAuthUrl = 'https://api.jamendo.com/v3.0/oauth/authorize';
  const redirectUri = 'http://localhost:5173/auth/callback'; // frontedn callback URL
  
  const params = new URLSearchParams({
    client_id: process.env.JAMENDO_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: state
  });

  res.redirect(`${jamendoAuthUrl}?${params.toString()}`);
});

export default router;
