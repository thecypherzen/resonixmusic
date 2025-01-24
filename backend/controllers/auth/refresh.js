import {
  authClient,
  AuthError,
  errorHandlers as handlers,
} from '../../utils/index.js';

async function refreshToken(req, res) {
  const startTime = Date.now();
  const resData = { headers: {}, results: [] };
  const { access_token } = req.cookies;
  if (!access_token) {
    return res.redirect('login');
  }
  try {
    const {
      refresh_token
    } = await authClient.getTokenData(access_token);
    if (!refresh_token) {
      throw new AuthError(
        `no refresh found for access_token`,
        {
          code: 'ERR_BAD_REQUEST', errno: 400,
          timeTaken: `${Date.now() - startTime}ms`,
        }
      );
    }
    try {
      const response = await authClient.refreshAuth(refresh_token);
      await authClient.cacheAuthData(response.data);
      resData.results.push(response.data);
      authClient.setDataHeaders(resData, {
        options: { 'x-took': response.timeTaken }
      });
      await authClient.setCookies(res, response.data);
      await authClient.clearRefreshToken(access_token);
      authClient.log({ req });
      return res.send(resData);
    } catch (error) {
      authClient.log({ message: error.message, type: 'error' });
      return handlers.generalError(error, res);
    }
  } catch (error) {
    authClient.log({ error });
    error.timeTaken = `${Date.now() - startTime}`;
    return handlers.generalError(error, res);
  }
}

export default refreshToken;
