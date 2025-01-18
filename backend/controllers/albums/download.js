import {
  matchedData,
  validationResult,
} from 'express-validator';

import {
  cacheClient,
  CacheClientError,
  cacheClientReady,
  errorHandlers as handlers,
  requestClient,
  RequestClientError,
  storage,
} from '../../utils/index.js';

import {
  CACHE_EXP_SECS,
  RESPONSE_CODES as resCodes,
  REQPARAMS as defaultParams,
} from '../../defaults/index.js';


async function download (req, res) {
  const cacheReadyError = await cacheClientReady(cacheClient);
  if (cacheReadyError) {
    return res.send(cacheReadyError);
  }

  // get and validate query params
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return handlers.validationError(validation.array(), res);
  }
  const queryParams = matchedData(req, {locations: ['query']});

  // check localstorage for album and stream it if found
  const fileName = `album_${queryParams.id}.zip`;
  const start = Date.now();
  const fSize = await storage.getFileSize(fileName);
  if (fSize > 0) {
    // set response headers
    requestClient.setResHeaders(res, {
        'x-took': `${Date.now() - start}ms`,
        'content-type': 'application/octet-stream',
        'content-length': `${fSize}`,
    });
    // stream data to client
    const dataReadStream = await storage.getReadStream(fileName);
    dataReadStream.pipe(res);
    dataReadStream.on('error', (error) => {
      requestClient.log({
        message: error.message + '\n',
        type: 'error',
      });
    });
    //response event listeners
    res.on('close', () => {
      requestClient.log({
        message: 'request client closed',
        type: 'warning',
      });
    });
    res.on('finish', () => {
      requestClient.log({ req });
    });
  } else {
    // fetch album remotely
    const config = {
      url: '/albums/file',
      params: {},
      responseType: 'stream',
    }
    // set query params, make request and handle error
    requestClient.setQueryParams(queryParams, config);
    try {
      const response = await requestClient.make(config);
      delete response.headers['accept-ranges'];
      // set response headers
      requestClient.setResHeaders(res, {
        ...response.headers,
        'content-type': 'application/octet-stream',
        'x-took': response.timeTaken,
      });
      // stream response to data and localstorage
      const dataWriteStream = await storage.getWriteStream(fileName);
      response.data.pipe(dataWriteStream);
      response.data.pipe(res);

      // write stream event listeners
      dataWriteStream.on('error', (error) => {
        requestClient.log({
          message: error.message + '\n',
          type: 'error',
        });
      });
      dataWriteStream.on('finish', () => {
        requestClient.log({
          message: `${fileName} saved successfully`,
          type: 'success',
        })
      });
      // response event listenerss
      res.on('close', () => {
        requestClient.log({
          message: 'request client closed',
          type: 'warning',
        });
      })
      res.on('finish', () => {
        requestClient.log({ req });
      });
    } catch (error) {
      requestClient.setResHeaders(res, {
        'x-took': error.timeTaken,
      });
      if (error.errno > 0) {
        requestClient.log({ message: error.message, type: 'error'});
        return res.status(error.errno).send();
      }
      requestClient.setResStatus(error.code, res);
      return res.send();
    }
    return null;
  }
}

export default download;
