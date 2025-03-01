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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is missing');
}
console.log(secret);
const serviceAccount = require('../../wanderconnect-740ef-firebase-adminsdk-fbsvc-08730ac6dd.json');
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
                    });
                    yield user.save();
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
                res.send({ token, user });
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
