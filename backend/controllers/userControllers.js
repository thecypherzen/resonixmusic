import { globalErrorHandler, requestClient } from '../utils/index.js';

export const getTopArtists = async (req, res) => {
  const config = {
    url: '/users/top',
    params: {
      limit: req.query.limit || 10
    }
  };

  try {
    const result = await requestClient.client(config);
    return res.send({ data: result?.data?.data ?? [] });
  } catch (err) {
    return globalErrorHandler(err, res);
  }
};