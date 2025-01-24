import {
  authClient
} from '../../utils/index.js';

async function isLoggedIn(req) {
  // verify client is logged in
  const { access_token = null } = req.cookies;
  if (!access_token) {
    return false;
  }
  const {
    expires_in,
    refresh_token
  } = await authClient.getTokenData(access_token);
  return expires_in > -2;

}

async function isLoggedOut(req) {
  // verify client is logged out
  const { access_token = null } = req.cookies;
  if (!access_token) {
    return true;
  }
  const {
    expires_in,
    refresh_token
  } = await authClient.getTokenData(access_token);
  return expires_in === -2;
}


const verifiers = {
  isLoggedIn,
  isLoggedOut,
}

export default verifiers;
