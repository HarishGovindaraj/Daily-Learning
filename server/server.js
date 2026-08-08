require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initScheduler } = require('./jobs/reminderJob');
const apiRoutes = require('./routes/api');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Data Engineering 45-Day Roadmap backend server is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize scheduler and load cron configs
  await initScheduler();
});
