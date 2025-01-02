import {
  matchedData,
  validationResult,
} from 'express-validator';
import {
  filterBy,
  getPageFromArray,
  globalErrorHandler,
  requestClient,
  sortBy,
} from '../utils';

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
      res.send({ data: [] })
    }
    results = results.data.data;
    // filter out non-streamable values
    const streamables = filterBy.streamable(results);
    return res.send({ data: streamables })
  } catch (error) {
    return globalErrorHandler(error, res);
  }
};

const streamTrack = async (req, res) => {

};

export {
  downloadTrack,
  getTrackById,
  getTrackDetails,
  getTrendingTracks,
  searchTracks,
  streamTrack
}
