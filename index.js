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
app.use('/api/google-drive', GoogleDriveRouter);
app.use('/api/meetings', MeetingRouter);
app.use('/api/blogs', blogRouter);

// Thay app.listen bằng server.listen
server.listen(port, () => {
  console.log("Server is running on port: " + port);
});
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});


global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   // console.log('connect to socket', socket.id);
//   global.chatSocket = socket;

//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     console.log("Online users:", Array.from(onlineUsers.entries())); // Log danh sách người dùng online
//   });

//   socket.on("send-msg", (data) => {
//     const sendUnderSocket = onlineUsers.get(data.to);
//     console.log("msg abcabc", data); // Log để kiểm tra dữ liệu nhận được
//     if (sendUnderSocket) {
//       socket.to(sendUnderSocket).emit("msg-recieve", {
//         from: data.from,
//         message: data.message,
//       });
//     }
//   });

//   socket.on("send-notification", (data) => {
//     const sendUnderSocket = onlineUsers.get(data.to);
//     if (sendUnderSocket) {
//       socket.to(sendUnderSocket).emit("notification-recieve", data.message)
//     }
//   })

//   socket.on("join-room", async ({ room_id, user_id }) => {
//     try {
//       const meeting = await Meeting.findOne({ room_id });

//       if (!meeting) {
//         return socket.emit("error", { message: "Meeting not found" });
//       }

//       if (meeting.status !== 'Scheduled') {
//         return socket.emit("error", { message: "Meeting is not active" });
//       }

//       if (!meeting.participant_ids.includes(user_id) && meeting.organizer_id.toString() !== user_id) {
//         return socket.emit("error", { message: "You are not allowed to join this meeting" });
//       }

//       socket.join(room_id);
//       console.log(`User ${user_id} joined room ${room_id}`);
//       socket.to(room_id).emit("user-joined", { user_id });
//     } catch (err) {
//       console.error("Error joining room:", err.message);
//     }
//   });

//   // Xử lý tín hiệu WebRTC
//   socket.on("webrtc-signal", ({ room_id, signal, user_id }) => {
//     socket.to(room_id).emit("webrtc-signal", { signal, user_id });
//   });

//   // Rời phòng
//   socket.on("leave-room", ({ room_id, user_id }) => {
//     socket.leave(room_id);
//     console.log(`User ${user_id} left room ${room_id}`);
//     socket.to(room_id).emit("user-left", { user_id });
//   });
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });

// })

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("Online users:", Array.from(onlineUsers.entries())); // Log danh sách người dùng online
  });

  socket.on("send-msg", (data) => {
    const sendUnderSocket = onlineUsers.get(data.to);
    console.log("msg abcabc", data); // Log để kiểm tra dữ liệu nhận được
    if (sendUnderSocket) {
      socket.to(sendUnderSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });

  socket.on("send-notification", (data) => {
    const sendUnderSocket = onlineUsers.get(data.to);
    if (sendUnderSocket) {
      socket.to(sendUnderSocket).emit("notification-recieve", data.message);
    }
  });

  socket.on("join-room", ({ room_id, user_id }) => {
    socket.join(room_id);
    socket.to(room_id).emit("user-joined", { user_id });
  });

  socket.on("webrtc-signal", ({ room_id, signal, user_id }) => {
    socket.to(room_id).emit("webrtc-signal", { signal, user_id });
  });

  socket.on("leave-room", ({ room_id, user_id }) => {
    socket.leave(room_id);
    socket.to(room_id).emit("user-left", { user_id });
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});
