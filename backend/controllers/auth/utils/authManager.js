import {
  authClient,
} from '../../../utils/index.js';

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


const manager = {
  sendData,
};

export default manager;
