import axios from 'axios';
import {
  matchedData,
  validationResult,
} from 'express-validator';

import {
  errorHandlers as handlers,
  filters,
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
  const ids = [
    123785, 123798, 123793, 123791, 123783, 123794,
    123781, 123780, 123777, 123782, 123797, 500246386,
    500246453, 500246480, 500246618, 500246656, 500246738,
    500246814, 500246966, 500247018, 500247068, 500247140,
    500247191, 500247207, 500247248, 500247291, 500247302,
    500247308, 500247321, 500247373, 500247385, 500247387,
    500247449, 500247465, 500247492, 500247497, 500247502,
    500247504, 500247505, 500247531
  ];
  const config = {
    url: '/playlists',
    params: {
      ...defaultParams,
    },
  };
  delete config.params['imagesize'];
  const queryParams = matchedData(req, { locations: ['query'] });
  if (!queryParams?.id) {
    queryParams.id = ids;
  }
  console.log(queryParams);
  requestClient.setQueryParams(queryParams, config);
  try {
    let response = await requestClient.make(config);
    // const filtered = await filters.playlists.byTracks(response.data.results);
    // console.log('filtered playlists\n', filtered);
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

export default getAll;
