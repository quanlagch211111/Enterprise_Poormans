const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const { default: mongoose } = require("mongoose");

const app = express();
const port = process.env.PORT || 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to DB successfully');
    })
    .catch((err) => {
        console.log('Failed to connect to DB: ' + err.message);
    });

const UserRouter = require('./src/routes/Userroutes');
const MessageRouter = require('./src/routes/messageRoute');
const AssignmentRouter = require('./src/routes/assignmentRoute');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', UserRouter);
app.use('/api/messages', MessageRouter);
app.use('/api/assignments', AssignmentRouter);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});