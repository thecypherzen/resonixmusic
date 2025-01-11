import {
  matchedData,
  validationResult,
} from 'express-validator';
import {
  cacheClient,
  cacheClientReady,
  filterBy,
  getPageFromArray,
  globalErrorHandler,
  requestClient,
  sortBy,
} from '../../utils/index.js';
import {
  AUDIO_CHUNK_SIZE,
  CACHE_EXP_SECS,
} from '../../defaults/index.js';


const audioIsComplete = (header) => {
  const [start, end] = header
        .replace(/^bytes (\d+)-/, '')
        .split('/').map(Number);
  return start + 1 >= end ? true : false;
}

const downloadTrack = async (req, res) => {

};

const getTrackById = async (req, res) => {
  const config = {
    url: `/tracks/${req.params.id}`,
  };
  try {
    const result = await requestClient.client(config);
    return res.send({ data: result?.data?.data ?? [] });
  } catch (error) {
    return globalErrorHandler(error, res);
  }
};

const getTrackDetails = async(req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).send({ errors: validation.array() });
  }
  const validParams = matchedData(req);
  console.log('fetching details of track: ', validParams.id);
  const config = {
    url: `tracks/${validParams.id}/inspect`,
    params: {  },
  };
  if (validParams.original) {
    config.params['original'] = validParams.original;
  }
  try {
    let details = await requestClient.client(config);
    if (!details?.data?.data ?? null) {
      return res.status(404).send({ error: 'NOT_FOUND' })
    }
    return res.send({
      track_id: validParams.id,
      data: details.data.data
    });
  } catch(error) {
    console.log(error);
    return globalErrorHandler(error, res);
  }
};

// get trending tracks
const getTrendingTracks = async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).send({ errors: validation.array() });
  }
  const validParams = matchedData(req);
  const config = {
    url: '/tracks/trending',
    params: {
      time: validParams.time,
    },
  };

  const extraParams = ['genre', 'time', 'sort_by']
  for (let param of extraParams) {
    if (validParams[param]) {
      config.params[param] = validParams[param];
    }
  }
  try {
    const response = await requestClient.client(config);
    // handle empty data set
    const rawTracks = response?.data?.data ?? null;
    if (!rawTracks) {
      return res.send({ page: '1/1', data: [] });
    }
    // filter out unstreamable tracks
    const streamableTracks = rawTracks
          .filter((track) => JSON.parse(track.is_streamable));
    // sort if needed
    if (validParams.sort_by) {
      sortBy.releaseDate(streamableTracks);
    }

    // paginate response data
    const pageResults = getPageFromArray({
      page: validParams.page,
      pageSize: validParams.page_size,
      array: streamableTracks,
    });
    return res.send({
      page: `${pageResults.page}/${pageResults.max}`,
      size: `${validParams.page_size}`,
      total: `${streamableTracks.length}`,
      data: pageResults.data,
    });
  } catch(err) {
    return globalErrorHandler(err, res);
  }
}

// search for tracks
const searchTracks = async (req, res) => {
  const config = {
    url: '/tracks/search',
    params: {},
  };
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).send({ errors: validation.array() });
  }
  const validQueries = matchedData(req);

  // set request query parameters
  const allowedQueries = [
    'bpm_max', 'bpm_min', 'genre', 'has_downloads',
    'is_purchaseable', 'includePurchaseable', 'key',
    'mood', 'only_downloadable', 'query','sort_by',
  ];
  for (let [key, value] of Object.entries(validQueries)) {
    if (allowedQueries.some((query) => query === key)) {
      if (key === 'sort_by'){
        key = 'sort_method'
      }
      config.params[key] = value;
    }
  }
  // make request and send result
  try {
    let results = await requestClient.client(config);
    if (!results?.data?.data ?? null) {
      res.send({ page: '1/1', data: [] })
    }
    results = results.data.data;
    // filter out non-streamable values
    const streamables = filterBy.streamable(results);
    const pageResults = getPageFromArray({
      page: validQueries.page,
      pageSize: validQueries.page_size,
      array: streamables,
    });

    return res.send({
      page: `${pageResults.page}/${pageResults.max}`,
      size: `${validQueries.page_size}`,
      total: `${streamables.length}`,
      data: pageResults.data,
    });
  } catch (error) {
    return globalErrorHandler(error, res);
  }
};

const streamTrack = async (req, res) => {
  // check Range header is set
  if (!req.headers.range){
    return res.status(416).send({error: 'stream requires range headers'});
  }
  // check validation and extract query params
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).send({ errors: validation.array() });
  }
  const queryParams = matchedData(req, { locations: ['query'] });
  const trackId = matchedData(req, { locations: ['params']}).id;

  // define start, end indices and
  const [start, end] = req.headers.range
    .replace(/bytes=/, '')
    .split('-')
    .map(Number);

  const CHUNK_SIZE = queryParams?.chunk_size || AUDIO_CHUNK_SIZE;
  const startIndex = Math.floor((start * CHUNK_SIZE)/CHUNK_SIZE);
  const endIndex = Math.floor((end || start + CHUNK_SIZE - 1))
  const hash = `track.${trackId}.chunk`;
  const field = `${startIndex}.${endIndex}`;
  const hdrsField = 'extraHdrs';
  let cachedData = null,
      startTime = null,
      timeTaken = null;

  // check cache for previous data
  if (!cacheClient.isReady) {
    // await cache client readiness
    const cacheReadyError = await cacheClientReady();
    if (!cacheReadyError) {
      startTime = Date.now();
      cachedData = await cacheClient.hGet(hash, field, true);
      timeTaken = Date.now() - startTime;
    }
  } else {
    // only runs if client is ready on first try
    startTime = Date.now();
    cachedData = await cacheClient.hGet(hash, field, true);
    timeTaken = Date.now() - startTime;
  }

  if (cachedData) {
    // get track signature
    const savedHeaders = JSON.parse(await cacheClient.hGet(
      hash, hdrsField));

    // change timestamp value in sXignDebug
    savedHeaders['x-signature-debug'].timestamp = Date.now();

    // set headers and send cached data
    res.set({
      ...savedHeaders,
      'x-signature-debug': JSON.stringify(
        savedHeaders['x-signature-debug']
      ),
      'content-length': `${endIndex - startIndex + 1}`,
      'x-took': `${timeTaken / 1000}ms`,
    });
    return res.status(206).send(cachedData);
  }
  else {
    // fetch data from api
    // define configuration
    const config = {
      url: `/tracks/${trackId}/stream`,
      params: {},
      headers: {
        Range: `bytes=${startIndex}-${endIndex}`,
      }
    };
    const requestParams = [
      'user_id', 'preview', 'skip_play_count', 'api_key',
      'skip_check', 'no_redirect', 'user_data',
    ];
    for (const [key, value] of Object.entries(queryParams)) {
      if (requestParams.some((query) => query === key)) {
        config.params[key] = value;
      }
    }

    // make request and save result
    try {
      const response = await requestClient.client(config);
      const resData = response?.data ?? null;
      const isComplete = audioIsComplete(
        response.headers['content-range']
      ).toString();
      // save data to cache
      if (resData) {
        try {
          await cacheClient.hSet(hash, field, resData);
          // extract reusable headers and cache them
          const headers = {
            'accept-ranges': response.headers['accept-ranges'],
            'content-range': response.headers['content-range'],
            'x-complete': isComplete,
            'content-type': response.headers['content-type'],
            'x-signature-debug': JSON.parse(response.headers['x-signature-debug']),
            'last-modified': response.headers['last-modified'],
            'vary': response.headers['vary']
          }
          await cacheClient.hSet(
            hash, hdrsField, Buffer.from(JSON.stringify(headers))
          );

          // set response headers and return response
          res.set({
            'x-complete': isComplete,
            ...response.headers,
          });
          return res.status(206).send(resData);
        } catch(error) {
          return globalErrorHandler(error, res);
        }
      } else {
        return res.status(404).send(
          { error: `track ${trackId} not found` }
        )
      }
    } catch(error) {
      return globalErrorHandler(error, res);
    }
  }
};

export {
  downloadTrack,
  getTrackById,
  getTrackDetails,
  getTrendingTracks,
  searchTracks,
  streamTrack
}
