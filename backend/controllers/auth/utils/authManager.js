import {
  authClient,
  errorHandlers as handlers,
} from '../../../utils/index.js';
import AuthError from './authError.js';

async function sendData(req, res) {
  const { access_token } = req.cookies;
  const resData = { headers: {}, results: [] };
  try {
    const time = Date.now();
    const authData = await authClient.getTokenData(access_token);
    authClient.setDataHeaders(resData, {
      options: {
        'x-took': `${Date.now() - time}ms`,
        error_message: 'user already logged in',
      },
    });
    resData.results.push(authData);
    return res.send(resData);
  } catch (error) {
    error.code = error?.code ?? 500;
    error.timeTaken = `${Date.now() - time}ms`;
    authClient.setDataHeaders(resData, { error });
    return res.send(resData);
  }
}

async function verifyAuth(req, res) {
  const {
    error = null,
    error_description = null,
    state = null
  } = req.query;
  // handle callback denied access
  if (error && error_description) {
    const currentState = await authClient.currentState();
    if (!currentState ||
        state !== currentState.toString('utf-8')) {
      const csrfError = new AuthError(
        'Possible CSRF attack detected',
        {
          'x-took': `0ms`,
          errno: 401,
          code: 'EUNKNOWN_ORIGIN',
        }
      );
      authClient.log({ error: csrfError, req, type: 'error' });
      return handlers.generalError(csrfError, res);
    }
    const deniedError = new AuthError(
      error_description, {
        errno: 401,
        code: 'EACCESS',
      }
    );
    authClient.log({ error: deniedError , req, type: 'error' });
    return handlers.accessDenied(deniedError, res);
  }
  try {
    const response = await authClient.grantAuth(req, res);
    const resData = { headers: {}, results: [ response.data ] };
    authClient.setDataHeaders(resData, { options: {
      'x-took': response.timeTaken,
    }});
    await authClient.cacheAuthData(response.data);
    await authClient.setCookies(res, response.data);
    authClient.log({ req });
    return res.send(resData);
  } catch (error) {
    authClient.log({ error, req, type: 'error'});
    return res;
  }
 }

const manager = {
  sendData,
  verifyAuth,
};

export default manager;
