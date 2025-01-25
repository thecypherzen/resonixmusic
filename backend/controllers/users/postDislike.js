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
  const dataParams = matchedData(req, { locations: ['body'] });
  const config = {
    method: 'POST',
    url: `/setuser/dislike`,
    data: qs.stringify({
      client_id: api.id,
      ...dataParams,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
  if (dataParams.full_count) {
    config.data.fullcount = dataParams.full_count;
    delete dataParams.full_count;
  }
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
