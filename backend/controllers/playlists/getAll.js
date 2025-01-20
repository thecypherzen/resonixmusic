import {
  matchedData,
  validationResult,
} from 'express-validator';

import {
  errorHandlers as handlers,
  requestClient,
  RequestClientError,
} from '../../utils/index.js';

import {
  RESPONSE_CODES as resCodes,
  REQPARAMS as defaultParams,
} from '../../defaults/index.js';

async function getAll(req, res) {
  const validation = validationResult(req);
  let lang = null;
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }
  const config = {
    url: '/tracks',
    params: {
      ...defaultParams,
    },
  };
  return res.send(config);
  const queryParams = matchedData(req, { locations: ['query'] });
}

export default getAll;
