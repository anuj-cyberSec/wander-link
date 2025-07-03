import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import User from '../models/user.model';
import path from 'path';
import nodemailer from 'nodemailer';
import { sendEmail, generateOtpEmailTemplate } from '../utils/email.utils';

dotenv.config({ path: path.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET as string;
if (!secret) {

    throw new Error('JWT_SECRET is missing');
}
console.log(secret);
const serviceAccount = {
    project_id: process.env.PROJECT_ID,
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n')

}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


// google sign in

const verifyGoogleToken = async (token: string) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        console.log(error);


    }
}


class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, name, photo } = req.body;
            const auth_provider = req.body.auth_provider || "email";
            const social_id = req.body.social_id || "";


            if (!email || !name || !photo) {
                res.send('Please provide email, name and photo');
                return;
            }
            let user = await User.findOne({ email: email });
            if (!user) {
                user = new User({
                    name: name,
                    email: email,
                    profilePic: photo,
                    auth_provider: auth_provider,
                    social_id: social_id,

                })
                await user.save();
                const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
                res.send({ token, user });
                return;
            }
            res.status(400).send('User already exists');
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send('Error');
            return;
        }

    }

    static async sendOTP(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).send('Please provide email and password');
                return;
            }
            let user = await User.findOne({ email: email });
            if (user) {
                if (user.verified) {
                    res.status(400).send('User already exists');
                    return;
                }
                else {
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    console.log("otp is ", otp);
                    user.otp = otp;
                    await user.save();
                    const to = email;
                    const subject = 'OTP for WanderLink registration';
                    const html = generateOtpEmailTemplate(otp);
                    await sendEmail(to, subject, html);
                    res.send('OTP sent to email');
                    return;
                }
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("otp is ", otp);

            // const transporter = nodemailer.createTransport({
            //     host: 'smtp.secureserver.net',
            //     port: 587,
            //     secure: false,
            //     auth: {
            //         user: process.env.EMAIL,
            //         pass: process.env.PASSWORD
            //     }
            // });
            // // console.log("transporter is ", transporter);    

            // const mailOptions = {
            //     from: process.env.EMAIL,
            //     to: email,
            //     subject: 'OTP for WanderLink registration',
            //     text: `Your OTP is ${otp}`
            // }
            // const result = await transporter.sendMail(mailOptions);
            // console.log("result is ", result);

            // creating new user with otp set

            const to = email;
            const subject = 'OTP for WanderLink registration';
            // const html = `Your OTP is ${otp}`;
            const html = generateOtpEmailTemplate(otp);

            await sendEmail(to, subject, html);
            const newUser = new User({
                email: email,
                otp: otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
                auth_provider: "email",
            });
            await newUser.save();

            // sending otp to user's email

            res.send('OTP sent to email');
            return;




        }
        catch (error) {
            console.log(error);
            res.status(500).send('Error');
            return;
        }
    }

    static async verifyOTP(req: Request, res: Response) {
        try {
            const { email, otp, password } = req.body;
            if (!email || !otp) {
                res.status(400).send('Please provide email and otp');
                return;
            }
            let user = await User.findOne({ email: email });
            if (!user) {
                res.status(400).send('User not found');
                return;
            }
            if (user.otp === otp && user.otpExpiry > new Date()) {
                user.password = password;
                user.otp = "";
                user.verified = true;
                await user.save();
                const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
                res.send({token});
                return;
            }

            res.status(400).send('Invalid otp');
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send('Error');
            return;
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            console.log("email is ", email);
            console.log("password is ", password);
            if (!email || !password) {
                res.status(400).send('Please provide email and password');
                return;
            }
            let user = await User.findOne({ email: email });
            console.log("user is ", user);
            if (!user) {
                res.status(400).send('User not found');
                return;
            }
            if (user.password !== password) {
                res.status(400).send('Invalid password');
                return;
            }
            const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
            res.send({ token, isProfileCompleted: user.profileCompleted });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send('Error');
            return;
        }
    }

}

export default AuthController;