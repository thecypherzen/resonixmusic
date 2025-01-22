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
  REQPARAMS as defaultParams,
} from '../../defaults/index.js';

async function getInfo(req, res) {
  console.log('getinfo called...');
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }

  const config = {
    url: '/artists/musicinfo',
    params: {
      ...defaultParams,
    },
  };
  delete config.params['imagesize'];
  const queryParams = matchedData(req, { locations: ['query'] });
  requestClient.setQueryParams(queryParams, config);
  try {
    const response = await requestClient.make(config);
    requestClient.setDataHeaders(response.data, {
      options: { 'x-took': response.timeTaken },
    });
    requestClient.log({ req });
    return res.send(response.data);
  } catch (error) {
    const resData = {};
    requestClient.setDataHeaders(resData, {
      error, options: {'x-took': error.timeTaken },
    });
    if (error.errno > 0) {
      requestClient.log({ message: error.message, type: 'error' });
      return res.status(error.errno).send(resData);
    }
    requestClient.setResStatus(error.code, res);
    requestClient.log({ req });
    return res.send(resData);
  }
}

export default getInfo;
