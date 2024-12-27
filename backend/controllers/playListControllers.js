// define controllers for playlist route
import {
  globalErrorHandler,
  requestClient,
} from '../utils';

const getPlaylistById = async (req, res) => {
  // fetch playlist by id
  console.log('fetching playlist by id....>', req.params.id);
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
  console.log('searching playlists');
};

export {
  getPlaylistById,
  getPlaylistTracks,
  getTrendingPlaylists,
  searchPlaylists,
};
