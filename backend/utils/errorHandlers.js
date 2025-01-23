import {
  requestClient,
  RequestClientError,
  AuthError,
} from './index.js';

import {
  RESPONSE_CODES as resCodes,
} from '../defaults/index.js';

const validationError = (errorsArray, res) => {
  const resBody = { headers: {}, results: [] };
  const errCode = errorsArray.client_id ? 4 : 3;
  const errorObj = new RequestClientError(
    `${resCodes[errCode].type}: ${resCodes[errCode.des]}`,
    {
      code: resCodes[errCode].code,
      errno: -1,
      stack: errorsArray,
    }
  );
  requestClient.setDataHeaders(resBody, { error: errorObj });
  return res.status(400).send(resBody);
};

const generalError = (error, res) => {
  const resBody = { headers: {}, results: [] };
  requestClient.setDataHeaders(resBody, { error });
  return res.status(error.errno > 0 ? error.errno : 500)
            .send(resBody);
}
const handlers = {
  generalError,
  validationError,
};

export default handlers;
