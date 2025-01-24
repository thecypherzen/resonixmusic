import {
  authClient
} from '../../utils/index.js';

async function tokenExpired(req) {
  const { access_token } = req.cookies;
  if (!access_token) {
    return true;
  }
  const {
    expires_in,
    refresh_token,
  } = await authClient.getTokenData(access_token);
  console.log('tokenExpired:', expires_in);
  return refresh_token && (expires_in < 1);
}

async function isLoggedIn(req) {
  // verify client is logged in
  const { access_token = null } = req.cookies;
  if (!access_token) {
    return false;
  }
  const {
    expires_in,
  } = await authClient.getTokenData(access_token);
  return expires_in > 0;
}

async function isLoggedOut(req) {
  // verify client is logged out
  const { access_token = null } = req.cookies;
  if (!access_token) {
    return true;
  }
  const {
    refresh_token
  } = await authClient.getTokenData(access_token);
  return !refresh_token;
}


const verifiers = {
  isLoggedIn,
  isLoggedOut,
}

export default verifiers;
