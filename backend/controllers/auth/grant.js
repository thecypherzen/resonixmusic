import {
  authClient,
  AuthError,
  errorHandlers as handlers,
} from '../../utils/index.js';

async function grantAuth(req, res) {
  const resData = { headers: {}, results: [] };
  try {
    const response = await authClient.grantAuth(req, res);
    try {
      await authClient.cacheAuthData(response.data);
      resData.results.push(response.data);
      authClient.setDataHeaders(resData, {
        options: { 'x-took': response.timeTaken }
      })
      // save access_code in cookie
      await authClient.setCookies(res, response.data);
      return res.send(resData);
    } catch (error) {
      console.error(error);
      return handlers.generalError(error, res);
    }
  } catch (error) {
    authClient.setDataHeaders(resData, {
      error, options: {
        'x-took': error.timeTaken || '',
        error_title: error?.error || '',
        error_description: error?.error_description ?? '',
        code: error?.code ?? error.errno,
      }
    });
    authClient.log({
      message: `${error.title} ${error.error_message}`,
      type: 'error',
    })
    return res.status(error.errno).send(resData);
  }
}

export default grantAuth;
