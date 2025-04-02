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

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

global.onlineUsers = new Map(); // To store users and their socket IDs


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
// const GoogleDriveRouter = require('./src/routes/GoogleDriveRoute');
const UserRouter = require('./src/routes/Userroutes');
const MessageRouter = require('./src/routes/messageRoute');
const AssignmentRouter = require('./src/routes/assignmentRoute');
// const MeetingRouter = require('./src/routes/meetingRoute');
const blogRouter = require('./src/routes/blogRoute');
const notificationRouter = require('./src/routes/notificationRoute');

app.use(cors(
  {
    origin: "http://localhost:3000",
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
// app.use('/api/google-drive', GoogleDriveRouter);
// app.use('/api/meetings', MeetingRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/notifications', notificationRouter );

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

  // Join room
  socket.on("join-room", ({ room_id, user_id }) => {
    socket.join(room_id);
    socket.to(room_id).emit("user-joined", { user_id });
  });

  // Leave room
  socket.on("leave-room", ({ room_id, user_id }) => {
    socket.leave(room_id);
    socket.to(room_id).emit("user-left", { user_id });
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