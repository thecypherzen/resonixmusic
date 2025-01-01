import {
  matchedData,
  validationResult,
} from 'express-validator';
import {
  getPageFromArray,
  globalErrorHandler,
  requestClient,
} from '../utils';

const downloadTrack = async (req, res) => {

};

const getTrackById = async (req, res) => {

};

const getTrackDetails = async(req, res) => {

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
          .filter((track) => track.is_streamable);
    // sort if needed
    if (validParams.sort_by) {
      streamableTracks.sort(
        (trackA, trackB) => {
          const da = Date.parse(trackA.release_date);
          const db = Date.parse(trackB.release_date);
          return db - da;
        });
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

const searchTracks = async (req, res) => {

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
