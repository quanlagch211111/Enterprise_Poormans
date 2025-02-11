const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
var cookieParser = require('cookie-parser');
dotenv.config();

const {default : mongoose} = require("mongoose");

const app = express();
const port = process.env.PORT || 3001


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));



mongoose.connect('mongodb+srv://duclmgch211370:03102003@enterpriseproject.cyy59.mongodb.net/?retryWrites=true&w=majority&appName=EnterpriseProject')
.then (()=>{
    console.log('ket noi DB thanh cong');
})
.catch ((err) =>
{
    console.log('ket noi DB that bai' + err.message);
});


// app.get('/', (req, res) => {
//     res.send("Hello world!!!")

// });


var UserRouter = require('./src/routes/Userroutes');


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', UserRouter);


app.listen(port, () =>{
    console.log("Server is running in port: " + port);
});