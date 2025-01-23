import {
  authClient
} from './utils/index.js';

async function authorize(req, res) {
  const response = await authClient.authorizeAuth(req, res);
  return response;
}

export default authorize;
