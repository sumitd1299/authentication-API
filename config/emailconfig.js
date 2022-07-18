require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true, //true for 465, false for other ports (587)
    auth: {
        user: process.env.EMAIL_USER, //admin gmail id
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;