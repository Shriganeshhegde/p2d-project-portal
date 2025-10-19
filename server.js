require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { supabase, supabaseAdmin } = require('./utils/supabase');

const app = express();
const server = createServer(app);

// Middleware - Allow localhost and production (updated for deployment)
const allowedOrigins = [
  'http://localhost:3000',
  'https://p2d-project-portal.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection
  await testSupabaseConnection();
  
  console.log('🔒 Authentication: Enabled');
  console.log(`📁 Storage Bucket: ${process.env.SUPABASE_STORAGE_BUCKET}`);
  console.log(`🌍 CORS Allowed Origins: ${process.env.NEXT_PUBLIC_APP_URL || '*'}`);
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
