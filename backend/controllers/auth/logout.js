import {
  authClient,
  AuthError,
  errorHandlers as handlers,
} from '../../utils/index.js';
import {
  verifiers,
} from '../../controllers/index.js';

async function logout(req, res) {
  const startTime = Date.now();
  const resData = { headers: {}, results: [] };
  const loggedOut = await verifiers.isLoggedOut(req);
  console.log(req.cookies?.access_token);
  if (loggedOut) {
    authClient.log({
      message: 'user already loggedout',
      type: 'error',
      req,
    });
    resData.headers = {
      'status': 'failed',
      'error_message': 'user already logged out',
      'code': 403,
      'x-took': `${Date.now() - startTime}ms`,
    };
    await authClient.setDataHeaders(resData, {});
    return res.status(403).send(resData);
  }
  const { access_token } = req.cookies;
  if (!access_token) {
    return res.redirect('login');
  }
  try {
    const response = await authClient.clearTokenData(access_token);
    await authClient.setDataHeaders(resData, {
      options: { 'x-took': `${Date.now() - startTime}ms` }
    });
    await res.clearCookie('access_token', { path: '/auth' });
    authClient.log({ req });
    return res.send(resData);
  } catch (error) {
    authClient.log({ message: error.message, type: 'error' });
    await res.setDataHeaders(resData, { error });
    return res.status(error.errno > 0 ? error.errno : 500)
              .send(resData);
  }
}

export default logout;
