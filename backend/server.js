// Backend server
import express from 'express';
import { playlistRouter } from './routes';

const app = express();

app.use('/playlists', playlistRouter);

app.listen(process.env.RXSERVER || 5000, () => {
  console.log('resonix server listening on port',
    process.env.RXSERVER || 5000);
});
