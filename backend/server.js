import express from 'express';
import cors from 'cors';
import {
  albumsRouter,
  playlistRouter,
  tracksRouter,
  userRouter
} from './routes/index.js';
import {
  RESPONSE_CODES as resCodes,
  RXBE_PORT,
} from './defaults/index.js';

const app = express();

// Ensure only supported routes are treated
app.use('/', (req, res, next) => {
  const acceptedRoutes = [
    'albums', 'artists', 'feeds',
    'playlists', 'radios', 'reviews',
    'tracks', 'users',
  ];
  const requestRoutes = req.url.split('/').filter((val) => val);
  if (!requestRoutes.length
      || !acceptedRoutes.some((path) => path === requestRoutes[0])) {
    return res.status(404).send({
      headers: {
        status: 'failed',
        code: `${resCodes[22].code}`,
        error_message: 'route is not supported',
        warning: '',
      }
    });
  }
  return next();
});

// Middlewares
// - CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// - json body-parser
app.use(express.json());
// - query-parser setting
app.set('query parser', 'extended');
// Error catching
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    message: err.message
  });
});

// Routers
app.use('/albums', albumsRouter);
app.use('/playlists', playlistRouter);
app.use('/tracks', tracksRouter);
app.use('/users', userRouter);

// Native routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// Global listener
app.listen(RXBE_PORT, () => {
  console.log(`Resonix Server listening on port ${RXBE_PORT}`);
});

// Events
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
