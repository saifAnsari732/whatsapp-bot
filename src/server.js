require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const app = require('./app');
const keepAlive = require('./services/keepAlive.service');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
// |drngjdrnbjdrb
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Frontend client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Frontend client disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Webhook endpoint is ready at /webhook`);
      keepAlive(); // Server ko Render par jagte rakhta hai
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });
