import express from 'express';
import cors from 'cors';
import swaggerDocs from './utils/swagger/config.js';
import {
  albumsRouter,
  artistsRouter,
  playlistRouter,
  tracksRouter,
  userRouter
} from './routes/index.js';
import {
  RESPONSE_CODES as resCodes,
  RXBE_PORT,
} from './defaults/index.js';

const app = express();

// Middlewares
// - CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// - json body-parser
app.use(express.json());
// - query-parser setting
app.set('query parser', 'extended');

// Routers
swaggerDocs(app); // middlewares for swagger docs
app.use('/albums', albumsRouter);
app.use('/artists', artistsRouter);
app.use('/playlists', playlistRouter);
app.use('/tracks', tracksRouter);
app.use('/users', userRouter);

// Native routes
/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Healthcheck
 *     summary: Verify status of server
 *     description: Checks if the api is alive an active. If alive, a json respons is sent back else, nothing.
 *     responses:
 *       200:
 *         description: Resonix API is up and running.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use((req, res) => {
  return res.status(404).send({
    headers: {
      status: 'failed',
      code: resCodes[22].code,
      error_message: resCodes[22].des,
        warning: '',
      'x-took': '0ms'
    }
  });
});

// Global listener
app.listen(RXBE_PORT, '0.0.0.0', () => {
  console.log(`Resonix Server listening on port ${RXBE_PORT}`);

});

// Events
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
