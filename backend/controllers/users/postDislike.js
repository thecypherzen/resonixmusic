import qs from 'qs';
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
  JAMENDO as api,
} from '../../defaults/index.js';

async function postDislike(req, res) {
  const validation = validationResult(req);

  // verify no validation error
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }
  const queryParams = matchedData(req, { locations: ['query'] });
  const config = {
    method: 'POST',
    url: `/setuser/dislike/`,
    params: {
      format: defaultParams.format,
      client_id: api.id,
    },
  };
  requestClient.setQueryParams(queryParams, config);
  const data = qs.stringify(config.params);
  config.data = data;
  delete config.params;
  // make request
  try {
    const response = await requestClient.make(config);
    console.log('data:\n',response.data);
    requestClient.setDataHeaders(response.data, {
      options: { 'x-took': response.timeTaken }
    });
    requestClient.log({ req });
    return res.send(response.data);
  } catch (error) {
    console.error(error);
    const resData = { headers: {}, results: [] };
    requestClient.log({ error, req });
    return handlers.generalError(error, res);
  }
}

export default postDislike;
