import {
  authClient,
  errorHandlers as handlers,
} from '../../utils/index.js';

async function grantAuth(req, res) {
  const response = await authClient.grantAuth(req, res);
  if (response.data) {
    console.log('received_data\n', response.data);
    try {
      await authClient.cacheAuthData(response.data);
      const resData = {
        headers: {}, results: [response.data],
      };
      authClient.setDataHeaders(resData, {
        options: { 'x-took': response.timeTaken }
      })
      return res.send(resData);
    } catch (error) {
      console.error(error);
      return handlers.generalError(error, res);
    }
  }
  return res.end();
}

export default grantAuth;
