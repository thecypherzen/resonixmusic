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
  console.log('geting tracks...');
  const validation = validationResult(req);
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
  console.log('QUERY PARAMS:', queryParams);
  requestClient.setQueryParams(queryParams, config);
  const response = requestClient.make(config);
  return res.send({controller: 'getTracks'});
}

export default getTracks;
