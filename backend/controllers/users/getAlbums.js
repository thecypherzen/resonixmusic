<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 89f8282 (feat: implement getUsersAlbums controller and router)
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
    url: `/users/albums`,
    params: { ...defaultParams },
  };

  const queryParams = matchedData(req, { locations: ['query'] });
  requestClient.setQueryParams(queryParams, config);
<<<<<<< HEAD
=======
  // return res.send(config);
>>>>>>> 89f8282 (feat: implement getUsersAlbums controller and router)
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
<<<<<<< HEAD
=======
    // req.res = res; [TEMPORAL - uncomment after check]
>>>>>>> 89f8282 (feat: implement getUsersAlbums controller and router)
    requestClient.setDataHeaders(resData, {
      error, options: {'x-took': error.timeTaken },
       });
  } finally {
    requestClient.log({ req });
    return res.send(resData);
  }
<<<<<<< HEAD
=======
async function getAlbums(req, res) {
  return res.send({ endpoint: 'getUsersAlbums' });
>>>>>>> 51c812b (build(controllers): add users controllers skeleton)
=======
>>>>>>> 89f8282 (feat: implement getUsersAlbums controller and router)
}

export default getAlbums;
