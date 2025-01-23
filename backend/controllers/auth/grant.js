import {
  authClient
} from './utils/index.js';

async function grantAuth(req, res) {
  const response = await authClient.grantAuth(req, res);
  if (response.data) {
    return res.send(response.data);
  }
  return res.end();
}

export default grantAuth;
