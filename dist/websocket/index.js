"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const socket_io_1 = require("socket.io");
const chat_handler_1 = require("./handlers/chat.handler");
const server = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins
            methods: ['GET', 'POST'], // Allowed HTTP methods
            allowedHeaders: ['Content-Type'], // Allowed headers
            credentials: true, // Allow credentials
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
