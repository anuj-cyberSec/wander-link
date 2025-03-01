"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is missing');
}
const authentication = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, secret);
        console.log(verified);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).send('Invalid Token');
        return;
    }
};
exports.default = authentication;
