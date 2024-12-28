// define controllers for playlist route
import {
  matchedData,
  validationResult,
} from 'express-validator';
import {
  globalErrorHandler,
  requestClient,
} from '../utils';


const getPlaylistById = async (req, res) => {
  // fetch playlist by id
  const config = {
    url: `/playlists/${req.params.id}`,
  };

  // make request and process response
  try {
    const result = await requestClient.client(config);
    return res.send(result?.data?.data ?? 'no data found');
  } catch(err) {
    return globalErrorHandler(err, res);
  }
};

const getPlaylistTracks = async(req, res) => {
  // fetch playlist tracks
};

const getTrendingPlaylists = async (req, res) => {
  // fetch trending playlists
  const config = {
    url: '/playlists/trending',
    params: {
      time: req.query.time || 'week',
    },
  };
  // make request and process response
  try {
    const result = await requestClient.client(config);
    return res.send({ data: result.data.data });
  } catch (err) {
    return globalErrorHandler(err, res);
  }
};

const searchPlaylists = async(req, res) => {
  // fetch playlist by search criteria
  const result = validationResult(req);
  if (result.isEmpty()) {
    const config = {
      url: '/playlists/search',
      params: {
        query: req.query.query,
      }
    };
    // extract validated query params and extend config
    const requestQuery = matchedData(req);
    if (requestQuery.genre) {
      config.params['genre'] = requestQuery.genre;
    }
    if (requestQuery.mood) {
      config.params['mood'] = requestQuery.mood;
    }
    config.params['sort_method'] = requestQuery.sort_by;
    // make request
    try {
      const response = await requestClient.client(config);
      return res.send({ data: response.data.data });
    } catch (err) {
      return globalErrorHandler(err, res);
    }
  }
  return res.status(400).send({ errors: result.array() });
};

export {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
};
