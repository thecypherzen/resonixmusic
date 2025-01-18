import {
  requestClient,
  RequestClientError,
} from '../utils/index.js';

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

const handlers = {
  validationError,
};

export default handlers;
