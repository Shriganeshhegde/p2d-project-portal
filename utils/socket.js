const { Server } = require('socket.io');
const { supabase } = require('./supabase');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.io authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Attach user to socket for later use
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user?.email} (${socket.id})`);

    // Join a room for the user
    socket.join(`user_${socket.user.id}`);

    // Handle document upload progress
    socket.on('upload:progress', (data) => {
      // Broadcast progress to the specific user's room
      io.to(`user_${socket.user.id}`).emit('upload:progress', data);
    });

    // Handle real-time notifications
    socket.on('notify:subscribe', (data) => {
      if (data.room) {
        socket.join(data.room);
        console.log(`User ${socket.user.id} joined room ${data.room}`);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.email} (${socket.id})`);
    });
  });

  // Make io accessible to other modules
  global.io = io;
  return io;
};

// Helper function to send notifications to a specific user
const notifyUser = (userId, event, data) => {
  if (global.io) {
    global.io.to(`user_${userId}`).emit(event, data);
  }
};

// Helper function to broadcast to a room
const broadcastToRoom = (room, event, data) => {
  if (global.io) {
    global.io.to(room).emit(event, data);
  }
};

module.exports = {
  setupSocket,
  notifyUser,
  broadcastToRoom
};
