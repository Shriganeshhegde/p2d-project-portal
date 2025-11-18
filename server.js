require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { supabase, supabaseAdmin } = require('./utils/supabase');

const app = express();
const server = createServer(app);

// Middleware - CORS configuration
// Allow configuring allowed origins via the CORS_ALLOWED_ORIGINS env var (comma-separated).
// Falls back to localhost and the Vercel preview URL.
const defaultOrigins = [
  'http://localhost:3000',
  'https://p2d-project-portal.vercel.app'
];

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : defaultOrigins;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In production, reject unknown origins
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // Allow all in development
      }
    }
  },
  credentials: true
}));
// Ensure preflight (OPTIONS) requests get proper CORS headers
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root - redirect to health for easy verification when someone visits the base domain
app.get('/', (req, res) => {
  return res.redirect('/api/health');
});

// Debug: expose allowed origins and raw env var for quick verification
// NOTE: temporary — remove after debugging
app.get('/api/debug/origins', (req, res) => {
  try {
    return res.json({
      allowedOrigins,
      rawEnv: process.env.CORS_ALLOWED_ORIGINS || null,
      nodeEnv: process.env.NODE_ENV || null
    });
  } catch (err) {
    return res.status(500).json({ error: 'debug-failed', details: err.message });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/page-counter', require('./routes/pageCounter'));
app.use('/api/files', require('./routes/fileUpload'));
app.use('/api/deadlines', require('./routes/deadlines'));
app.use('/api/vendor', require('./routes/vendor'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  // Return a clearer 403 when CORS middleware rejects the origin
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS origin not allowed', details: err.message });
  }
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Test Supabase connection on startup
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
      
    if (error) throw error;
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
  }
}

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Bind to all interfaces for Railway
server.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection
  await testSupabaseConnection();
  
  console.log('🔒 Authentication: Enabled');
  console.log(`📁 Storage Bucket: ${process.env.SUPABASE_STORAGE_BUCKET}`);
  console.log(`🌍 CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
