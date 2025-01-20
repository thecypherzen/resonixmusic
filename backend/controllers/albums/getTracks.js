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

async function getTracks (req, res) {
  // validate query parameters
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }

  // request tracks from remote
  const config = {
    url: `/albums/tracks`,
    params: { ...defaultParams },
  };
  const queryParams = matchedData(req, { locations: ['query'] });

  // set query parameters and make request
  requestClient.setQueryParams(queryParams, config);

  // return res.send(config);
  let resData = null;
  try {
    const response = await requestClient.make(config);
    // set response.data.headers
    requestClient.setDataHeaders(response.data, {
      options: { 'x-took': response.timeTaken },
    });
    resData = response.data;
    requestClient.log({ req });
    return res.send(resData);
  } catch (error) {
    resData = {};
     requestClient.setDataHeaders(resData, {
      error, options: {'x-took': error.timeTaken },
    });
    // set headers in resData
    if (error.errno > 0) {
      requestClient.log({ message: error.message, type: 'error' });
      return res.status(error.errno).send(resData);
    }
    requestClient.setResStatus(error.code, res);
    requestClient.log({ req });
    return res.send(resData);
  }
  return null;
}

export default getTracks;
