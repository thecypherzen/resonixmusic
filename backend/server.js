import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {
  playlistRouter,
  tracksRouter,
  userRouter
} from './routes/index.js';

const app = express();
const RXSERVER = process.env.RXSERVER || 5005;

// Ensure only supported routes are treated
app.use('/', (req, res, next) => {
  const acceptedRoutes = [
    'playlists', 'tracks', 'users',
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

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.set('query parser', 'extended');

// Routes
app.use('/playlists', playlistRouter);
app.use('/tracks', tracksRouter);
app.use('/users', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(RXSERVER, () => {
  console.log(`Resonix Server listening on port ${RXSERVER}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});