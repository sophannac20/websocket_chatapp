const jwt = require('jsonwebtoken');
let typingUsers = new Set(); // Store usernames who are typing
let connectedUsers = {}; // Store userId -> socketId

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    let userId = null;
    let username = null;

    // Authenticate user
    socket.on('authenticate', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.user.id;
        console.log(decoded.user)
        connectedUsers[userId] = socket.id;
        io.emit('authenticated', userId);
      } catch (err) {
        console.error("Authentication failed:", err.message);
        socket.emit('unauthorized', 'Invalid token');
        socket.disconnect();
      }
    });

    // Handle typing
    socket.on('typing', (username) => {
      if (username) {
        typingUsers.add(username);
        io.emit('updateTypingUsers', Array.from(typingUsers));
      }
    });

    // Handle stop typing
    socket.on('stopTyping', (username) => {
      if (typingUsers.has(username)) {
        typingUsers.delete(username);
        io.emit('updateTypingUsers', Array.from(typingUsers));
      }
    });

    // Handle sending message
    socket.on('sendMessage', (message) => {
      io.emit('receiveMessage', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (userId) {
        delete connectedUsers[userId];
        io.emit('userDisconnected', userId);
        console.log(`User disconnected: ${userId}`);
      }
    });
  });
};