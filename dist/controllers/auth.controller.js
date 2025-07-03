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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const path_1 = __importDefault(require("path"));
const email_utils_1 = require("../utils/email.utils");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is missing');
}
console.log(secret);
const serviceAccount = {
    project_id: process.env.PROJECT_ID,
    client_email: process.env.CLIENT_EMAIL,
    private_key: (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')
};
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
// google sign in
const verifyGoogleToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = yield firebase_admin_1.default.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        console.log(error);
    }
});
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, photo } = req.body;
                const auth_provider = req.body.auth_provider || "email";
                const social_id = req.body.social_id || "";
                if (!email || !name || !photo) {
                    res.send('Please provide email, name and photo');
                    return;
                }
                let user = yield user_model_1.default.findOne({ email: email });
                if (!user) {
                    user = new user_model_1.default({
                        name: name,
                        email: email,
                        profilePic: photo,
                        auth_provider: auth_provider,
                        social_id: social_id,
                    });
                    yield user.save();
                    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
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
        });
    }
    static sendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).send('Please provide email and password');
                    return;
                }
                let user = yield user_model_1.default.findOne({ email: email });
                if (user) {
                    if (user.verified) {
                        res.status(400).send('User already exists');
                        return;
                    }
                    else {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        console.log("otp is ", otp);
                        user.otp = otp;
                        yield user.save();
                        const to = email;
                        const subject = 'OTP for WanderLink registration';
                        const html = (0, email_utils_1.generateOtpEmailTemplate)(otp);
                        yield (0, email_utils_1.sendEmail)(to, subject, html);
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
                const html = (0, email_utils_1.generateOtpEmailTemplate)(otp);
                yield (0, email_utils_1.sendEmail)(to, subject, html);
                const newUser = new user_model_1.default({
                    email: email,
                    otp: otp,
                    otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
                    auth_provider: "email",
                });
                yield newUser.save();
                // sending otp to user's email
                res.send('OTP sent to email');
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).send('Error');
                return;
            }
        });
    }
    static verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp, password } = req.body;
                if (!email || !otp) {
                    res.status(400).send('Please provide email and otp');
                    return;
                }
                let user = yield user_model_1.default.findOne({ email: email });
                if (!user) {
                    res.status(400).send('User not found');
                    return;
                }
                if (user.otp === otp && user.otpExpiry > new Date()) {
                    user.password = password;
                    user.otp = "";
                    user.verified = true;
                    yield user.save();
                    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
                    res.send({ token });
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
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log("email is ", email);
                console.log("password is ", password);
                if (!email || !password) {
                    res.status(400).send('Please provide email and password');
                    return;
                }
                let user = yield user_model_1.default.findOne({ email: email });
                console.log("user is ", user);
                if (!user) {
                    res.status(400).send('User not found');
                    return;
                }
                if (user.password !== password) {
                    res.status(400).send('Invalid password');
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
                res.send({ token, isProfileCompleted: user.profileCompleted });
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).send('Error');
                return;
            }
        });
    }
}
exports.default = AuthController;
