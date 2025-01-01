import express from 'express';
import { playlistRouter } from './routes';
import 'dotenv/config';

const RXSERVER = process.env.RXSERVER || 5000;
const app = express();

app.set('query parser', 'extended');
app.use('/playlists', playlistRouter);

app.listen(RXSERVER, () => {
  console.log(`Resonix Server listening on port ${RXSERVER}`)
  }
);
