require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const bookRoutes = require('./routes/bookRoutes');
const workRoutes = require('./routes/workRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// HTTP Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : statusCode >= 300 ? '\x1b[36m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(`[${timestamp}] ${method} ${originalUrl} ${statusColor}${statusCode}${resetColor} - ${duration}ms (${ip})`);
  });

  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/works', workRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Rising Media Works API is running...',
    timestamp: new Date().toISOString(),
    endpoints: {
      adminFcmTokenStore: {
        method: 'POST',
        path: '/api/admin/token',
        payload: { token: 'FCM_TOKEN_STRING', deviceInfo: 'Optional device info' }
      },
      adminFcmTokensList: {
        method: 'GET',
        path: '/api/admin/tokens'
      },
      adminFcmTokenDelete: {
        method: 'DELETE',
        path: '/api/admin/token',
        payload: { token: 'FCM_TOKEN_STRING' }
      }
    }
  });
});

// Global 404 Error Handler
app.use((req, res) => {
  console.warn(`[${new Date().toISOString()}] [404 NOT FOUND] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] [SERVER ERROR] ${err.stack || err.message}`);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] [SERVER START] Server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] [FCM ADMIN ROUTE] POST http://localhost:${PORT}/api/admin/token ready to accept FCM Tokens`);
});
