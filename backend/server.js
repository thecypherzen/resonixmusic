import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  playlistRouter,
  tracksRouter,
  userRouter
} from './routes/index.js';

const app = express();
const RXSERVER = process.env.RXSERVER || 5005;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const allowedOrigins = [
  'https://resonix.vercel.app',
  'https://www.resonix.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('query parser', 'extended');

// Route validation middleware
app.use('/', (req, res, next) => {
  const acceptedRoutes = ['playlists', 'tracks', 'users', 'health'];
  const requestRoutes = req.url.split('/').filter(val => val);
  
  // Allow health check endpoint
  if (req.url === '/health') return next();
  
  if (requestRoutes.length < 1) {
    return res.status(404).json({ 
      error: 'Route not found',
      status: 404 
    });
  }
  
  if (!acceptedRoutes.includes(requestRoutes[0])) {
    return res.status(403).json({ 
      error: 'Route is not supported',
      status: 403 
    });
  }
  
  next();
});

// Health check endpoint (place before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/playlists', playlistRouter);
app.use('/tracks', tracksRouter);
app.use('/users', userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    status: 404 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    status: err.status || 500
  });
});

// Start server
const server = app.listen(RXSERVER, () => {
  console.log(`Resonix Server running in ${process.env.NODE_ENV} mode on port ${RXSERVER}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
  
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
  
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});