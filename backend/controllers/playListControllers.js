// define controllers for playlist route
import axios from 'axios';
import { requestClient } from '../utils';

const getPlaylistById = async (req, res) => {
  // fetch playlist by id
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
  const result = await requestClient.client(config);
  if (result.status !== 200) {
    if (result.status === 400) {
      res.status(400).send({ error: 'Bad Request' });
    }
    if (res.status === 500) {
      res.status(500).send({ error: 'Internal server error' });
    }
    res.status(result.status)
      .send({ error: result.statusText || 'Unknown error occured' });
  }
  return res.send({ data: result.data.data });
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
