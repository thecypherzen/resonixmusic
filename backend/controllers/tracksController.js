import {
  matchedData,
  validationResult,
} from 'express-validator';
import {
  globalErrorHandler,
  requestClient,
} from '../utils';

// get trending tracks
const getTrendingTracks = async (req, res) => {
  /* query parameters:
   *  => genre(optional)
   *  => time (required) - week(default), month, year, allTime
   *  => sort_by(optional) - release_date only
   *  => page (optional) - default 1
   *  => page_size (optional) - default 20
   * * filter out unstreamable tracks
   */

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
  if (validParams.genre) {
    config['genre'] = validParams.genre;
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
        (trackA, trackB) => trackB.release_date - trackA.release_date)
      ;
    }
    // paginate response data
    const page = parseInt(validParams.page);
    const pageSize = parseInt(validParams.page_size);
    const iStart = (page - 1) * pageSize;
    const iEnd = (page * pageSize);
    return res.send({
      page: `${page}/${Math.ceil(stremableTracks.length/pageSize)}`;
      data: stremableTracks.slice(iStart, iEnd),
    });

  } catch(err) {
    return globalErrorHandler(err, res);
  }
}
