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
exports.generateOtpEmailTemplate = exports.sendEmail = void 0;
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
// const Email = 'founders@wonderconnect.in'
// const Password = 'wonder@connect_kunal&anuj'
const generateOtpEmailTemplate = (otp) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">WanderConnect - Email Verification</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">
            Your OTP for verifying your email address is:
        </p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; color: #007BFF;">
            ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">
            This OTP is valid for the next 10 minutes. Please do not share it with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
            © 2025 WanderConnect. All rights reserved.
        </p>
    </div>`;
};
exports.generateOtpEmailTemplate = generateOtpEmailTemplate;
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net', // GoDaddy SMTP server
            port: 465, // SSL port
            secure: true, // Use SSL
            auth: {
                user: process.env.Email,
                pass: process.env.Password
            },
        });
        console.log("transporter is ", transporter);
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
exports.sendEmail = sendEmail;
