"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const socket_io_1 = require("socket.io");
const chat_handler_1 = require("./handlers/chat.handler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const server = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins
            methods: ['GET', 'POST'], // Allowed HTTP methods
            allowedHeaders: ['Content-Type'], // Allowed headers
            credentials: true, // Allow credentials
        }
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const user = jsonwebtoken_1.default.verify(token, secret);
            socket.user = user;
            next();
        }
        catch (err) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        (0, chat_handler_1.chatHandler)(socket, io);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.server = server;
