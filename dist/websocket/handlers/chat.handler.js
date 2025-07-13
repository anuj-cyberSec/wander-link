"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = void 0;
const chatHandler = (socket, io) => {
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });
    // socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
    //     io.to(roomId).emit('receive-message', { message, sender: socket.id });
    // });
    socket.on('send-message', ({ roomId, message }) => {
        socket.to(roomId).emit('receive-message', { message, sender: socket.id });
    });
};
exports.chatHandler = chatHandler;
