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


async function getAlbums(req, res) {
  // get albums
  const validation = validationResult(req);

  // verify no validation error
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }

  const config = {
    url: `/albums`,
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
  } catch (error) {
    resData = {};
    // set headers in resData
    requestClient.setResStatus(error.code, res);
    // req.res = res; [TEMPORAL - uncomment after check]
    requestClient.setDataHeaders(resData, {
      error, options: {'x-took': error.timeTaken },
    });
  } finally {
    requestClient.log({ req });
    res.send(resData);
  }
}

export default getAlbums;
