const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const webhookRoutes = require('./routes/webhook.routes');
const apiRoutes = require('./routes/api.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parses application/json

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('WhatsApp Agent API is running.');
});

module.exports = app;
// >?dglxkl;dxtnmdnbz