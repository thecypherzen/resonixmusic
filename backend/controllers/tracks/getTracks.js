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
  TRACKSPARAMS as defaultTrackParams,
} from '../../defaults/index.js';

async function getTracks(req, res) {
  const validation = validationResult(req);
  let lang = null;
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }
  const config = {
    url: '/tracks',
    params: {
      ...defaultParams,
      ...defaultTrackParams,
    },
  };

  const queryParams = matchedData(req, { locations: ['query'] });
  if (queryParams[lang]) {
    lang = queryParams[lang];
    delete queryParams[lang];
  }
  requestClient.setQueryParams(queryParams, config);
  try {
    const response = await requestClient.make(config);
    requestClient.setDataHeaders(response.data, {
      options: { 'x-took': response.timeTaken },
    });
    requestClient.log({ req });
    if (lang) {
      response.data.results = response.data.filter((track) => {
        return track?.musicinfo?.lang === lang;
      });
    }
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

export default getTracks;
