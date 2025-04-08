"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
// const Email = 'founders@wonderconnect.in'
// const Password = 'wonder@connect_kunal&anuj'
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net', // GoDaddy SMTP server
            port: 465, // SSL port
            secure: true, // Use SSL
            auth: {
                user: 'founders@wanderconnect.in', // Your GoDaddy email address
                pass: 'wander@connect_kunal&anuj', // Your GoDaddy email password
            },
        });
        const mailOptions = {
            from: 'tech@wanderconnect.in', // Sender address
            to: to, // List of recipients
            subject: subject,
            html: html,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.default = sendEmail;
