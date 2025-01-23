import {
  authClient,
  errorHandlers as handlers,
} from '../../utils/index.js';

async function grantAuth(req, res) {
  const response = await authClient.grantAuth(req, res);
  if (response.data) {
    try {
      await authClient.cacheAuthData(response.data);
      const resData = {
        headers: {}, results: [response.data],
      };
      authClient.setDataHeaders(resData, {
        options: { 'x-took': response.timeTaken }
      })
      // save access_code in cookie
      res.cookie('access_token', response.data.access_token, {
        maxAge: response.data.expires_in * 1000,
        path: '/auth',
        secure: true,
      });
      return res.send(resData);
    } catch (error) {
      console.error(error);
      return handlers.generalError(error, res);
    }
  }
  return res.end();
}

export default grantAuth;
