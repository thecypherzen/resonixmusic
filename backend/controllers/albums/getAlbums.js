import {
  matchedData,
  validationResult,
} from 'express-validator';

import {
  requestClient,
} from '../../utils/index.js';

import {
  CACHE_EXP_SECS,
  RESPONSE_CODES as resCodes,
} from '../../defaults/index.js';


async function getAlbums(req, res) {
  // fetch as many albums as possible
  const validation = validationResult(req);
  const iHeaders = {
    warnings: '',
  };

  if (!validation.isEmpty()) {
    const errors = validation.array();
    console.log('validation errors\n', errors);
    return res.status(400).send({
      headers: {
        ...iHeaders,
        status: 'failed',
        code: errors.client_id
          ? resCodes[4].code : resCodes[3].code,
        error_message: errors,
      },
      results: [],
    });
  }

  const config = {
    url: `/albums`,
    params: {},
  };
  const queryParams = matchedData(req, { locations: ['query'] });
  // set query parameters and make request
  requestClient.setQueryParams(queryParams, config);

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
