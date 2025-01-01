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
  console.log('paylist by id')
  // fetch playlist by id
  const config = {
    url: `/playlists/${req.params.id}`,
  };

  // make request and process response
  try {
    const result = await requestClient.client(config);
    return res.send({ data: result?.data?.data ?? [] });
  } catch(err) {
    return globalErrorHandler(err, res);
  }
};

const getPlaylistTracks = async(req, res) => {
  // fetch a playlist's tracks
  const config = {
    url: `/playlists/${req.params.id}/tracks`,
  };
  try {
    const result = await requestClient.client(config);
    return res.send({ data: result?.data?.data ?? [] });
  } catch (err) {
    return globalErrorHandler(err, res);
  }
};

const getTrendingPlaylists = async (req, res) => {
  // fetch trending playlists
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).send({ errors: validation.array() });
  }
  const config = {
    url: '/playlists/trending',
    params: {
      time: req.query.time,
    },
  };
  // make request and process response
  try {
    const result = await requestClient.client(config);
    const data = result?.data?.data ?? null;
    if (!data) {
      return res.send({ data: [] });
    }
    // filter out unstreamable playlists
    const cleanData = data.filter((list) => list.access.stream);

    const limit = parseInt(req.query.limit);
    // sort playlist by specified order
    if (!req.query.sort_by) {
      return res.send({ data: limit >= 0
                        ? data.slice(0, limit)
                        : data });
    }
    const sortField = req.query.sort_by === 'tracks'
          ? 'track_count' : 'total_play_count';
    cleanData.sort((pListA, pListB) => {
      return pListB[sortField] - pListA[sortField];
    });

    // send response
    return res.send({ data: limit >= 0
                      ? cleanData.slice(0, limit)
                      : cleanData });
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
      return res.send({ data: response?.data?.data ?? [] });
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
