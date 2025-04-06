const express = require("express");
const dotenv = require("dotenv");
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');

dotenv.config();

const { default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/peerjs',
  concurrent_limit: 20, 
  proxied: true
});

const io = socket(server, {
  cors: {
    origin: process.env.ORIGINAL_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

global.onlineUsers = new Map(); // To store users and their socket IDs
const activeRooms = new Map();


// Xuất đối tượng io để sử dụng trong các file khác
module.exports = { io };

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to DB successfully');
  })
  .catch((err) => {
    console.log('Failed to connect to DB: ' + err.message);
  });

// const socketAuthMiddleware = require('./src/middlewares/SocketAuthMiddleware');
const SubmissionFolderRouter = require('./src/routes/submissionfolderRoute');
const documentRouter = require('./src/routes/documentRoute');
const otpRouter = require('./src/routes/otpRoute');
const GoogleDriveRouter = require('./src/routes/GoogleDriveRoute');
const UserRouter = require('./src/routes/Userroutes');
const MessageRouter = require('./src/routes/messageRoute');
const AssignmentRouter = require('./src/routes/assignmentRoute');
const MeetingRouter = require('./src/routes/meetingRoute');
const blogRouter = require('./src/routes/blogRoute');
const notificationRouter = require('./src/routes/notificationRoute');
const attendanceRouter = require('./src/routes/attendanceRoute');


app.use(cors(
  {
    origin: process.env.ORIGINAL_URL,
    credentials: true
  }
));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', UserRouter);
app.use('/api/messages', MessageRouter);
app.use('/api/submissionFolders', SubmissionFolderRouter);
app.use('/api/documents', documentRouter);
app.use('/api/assignments', AssignmentRouter);
app.use('/api/otp', otpRouter);
app.use('/api/google-drive', GoogleDriveRouter);
app.use('/api/meetings', MeetingRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/notifications', notificationRouter );
app.use('/api/attendances', attendanceRouter);

// Thay app.listen bằng server.listen
server.listen(port, () => {
  console.log("Server is running on port: " + port);
});





io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add user to the online users map
  socket.on("add-user", (userId) => {
    if (userId) {
      global.onlineUsers.set(userId, socket.id);

      console.log("Online Users Map:", [...global.onlineUsers]);
      console.log("User added:", userId);
    }
  });

  // Send message to a specific user
  socket.on("send-msg", (data) => {
    const receiverSocketId = global.onlineUsers.get(data.to);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("msg-receive", {
        from: data.from,
        message: data.message,
      });

      console.log(`Message sent to user ${data.from}, ${data.message}`);
    }
  });

  // Send notification to a specific user
  // socket.on("send-notification", async (data) => {
  //   try {
  //     const receiverSocketId = global.onlineUsers.get(data.to);
  //     if (receiverSocketId) {
  //       io.to(receiverSocketId).emit("notification-receive", {
  //         from: data.from,
  //         message: data.message,
  //       });
  //       console.log(`Notification sent to user ${data.to}`);
  //     } else {
  //       console.log(`User ${data.to} is not online. Notification stored in DB.`);
  //     }
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //   }
  // });

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    
    // Initialize room if not exists
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    
    // Add user to room
    activeRooms.get(roomId).add(userId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', userId);
    console.log(`User ${userId} joined room ${roomId}`);

    // Send list of existing users to the new participant
    const users = Array.from(activeRooms.get(roomId)).filter(id => id !== userId);
    socket.emit('existing-users', users);
    socket.emit('message-history', []);


    // // Message handling
    // socket.on('message', (message) => {
    //   io.to(roomId).emit('createMessage', {
    //     sender: userId,
    //     text: message,
    //     timestamp: new Date().toISOString()
    //   });
    // });
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      socket.to(roomId).emit('user-disconnected', userId);
      
      if (activeRooms.has(roomId)) {
        activeRooms.get(roomId).delete(userId);
        
        // Clean up empty rooms
        if (activeRooms.get(roomId).size === 0) {
          activeRooms.delete(roomId);
        }
      }
    });
  });

  socket.on('send-message', ({ roomId, userId, text }) => {
    const message = {
      sender: userId,
      text,
      timestamp: new Date().toISOString()
    };
    console.log(`Message`, message);
    
    // Save to database if needed
    // Then broadcast to room
    io.to(roomId).emit('new-message', message);
    
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove the user from the online users map when disconnected
    global.onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        global.onlineUsers.delete(key);
      }
    });
  });
});
