import { requestClient } from '../../utils/index.js';

export const getTopArtists = async (req, res) => {
  const config = {
    url: '/artists',
    params: {
      limit: req.query.limit || 10,
      order: 'popularity_total_desc'
    }
  };

  try {
    const response = await requestClient.make(config);
    return res.send({
      data: response.data.results || []
    });
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return res.status(500).json({
      error: 'Failed to fetch top artists'
    });
  }
};
