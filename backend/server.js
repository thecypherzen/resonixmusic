import express from 'express';
import cors from 'cors';
import { playlistRouter, trackRouter, userRouter } from './routes/index.js';
import 'dotenv/config';

const app = express();
const RXSERVER = process.env.RXSERVER || 5005;

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
app.use('/tracks', trackRouter);
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