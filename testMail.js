require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // user: "duclmgch211370@fpt.edu.vn",
        // pass: "etvfwicoahdmehts"
            user: "leduc03102003@gmail.com",
        pass: "klmr nlzr detd grko"
    
    }
});

const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: 'emailnguoinhan@gmail.com',
    subject: 'Test Mail',
    text: 'This is a test email'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
