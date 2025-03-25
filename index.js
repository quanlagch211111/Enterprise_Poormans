const express = require("express");
const dotenv = require("dotenv");
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

const UserRouter = require('./src/routes/Userroutes');
const MessageRouter = require('./src/routes/messageRoute');
const AssignmentRouter = require('./src/routes/assignmentRoute');

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

// Thay app.listen bằng server.listen
server.listen(port, () => {
    console.log("Server is running on port: " + port);
});

// Socket.IO setup
const socket = require('socket.io');
const io = socket(server,{
    cors :{
      origin : '*',
      credentials : true
    }
  })
const usersInRoom = {}; // all user(socket id) connected to a chatroom
const socketToRoom = {}; // roomId in which a socket id is connected

// io.use(socketAuthMiddleware);

io.on('connection', socket => {
    console.log('Someone joined socketId: ' + socket.id);

    socket.on("joinRoom", roomId => {
        if (usersInRoom[roomId]) {
            usersInRoom[roomId].push(socket.id);
        } else {
            usersInRoom[roomId] = [socket.id];
        }
        socketToRoom[socket.id] = roomId;
        const usersInThisRoom = usersInRoom[roomId].filter(id => id !== socket.id);
        socket.join(roomId);
        socket.emit("usersInRoom", usersInThisRoom);
    });

    socket.on("sendingSignal", payload => {
        console.log('Before sending userJoined', payload.callerId);
        io.to(payload.userIdToSendSignal).emit('userJoined', { signal: payload.signal, callerId: payload.callerId });
    });

    socket.on("returningSignal", payload => {
        io.to(payload.callerId).emit('takingReturnedSignal', { signal: payload.signal, id: socket.id });
    });

    socket.on('sendMessage', payload => {
        io.to(payload.roomId).emit('receiveMessage', { message: payload.message, name: socket.name, username: socket.username });
    });

    socket.on('disconnect', () => {
        const roomId = socketToRoom[socket.id];
        let socketsIdConnectedToRoom = usersInRoom[roomId];
        if (socketsIdConnectedToRoom) {
            socketsIdConnectedToRoom = socketsIdConnectedToRoom.filter(id => id !== socket.id);
            usersInRoom[roomId] = socketsIdConnectedToRoom;
        }
        socket.leave(roomId);
        socket.broadcast.emit("userLeft", socket.id);
    });

    socket.on("add-user", (userId) => {
        onlineUsers[userId] = socket.id;
      });
    
      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers[data.to];
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
      });
});
