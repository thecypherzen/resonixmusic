// Backend server
import express from 'express';
import {
  playlistRouter,
  tracksRouter,
} from './routes';

const app = express();

app.set('query parser', 'extended');
// ensure only supported routes are treated
app.use('/', (req, res, next) => {
  const acceptedRoutes = [
    'playlists', 'tracks',
  ];
  const requestRoutes = req.url.split('/').filter((val) => val);
  if (requestRoutes.length < 2) {
    return res.status(403).send({ error: 'route is not supported' });
  }
  if (!acceptedRoutes.some((path) => path === requestRoutes[0])) {
    return res.status(403).send({ end: 'route is not supported' });
  }
  return next();
});
app.use('/playlists', playlistRouter);
app.use('/tracks', tracksRouter);

app.listen(process.env.RXSERVER || 5000, () => {
  console.log('resonix server listening on port',
    process.env.RXSERVER || 5000);
});
