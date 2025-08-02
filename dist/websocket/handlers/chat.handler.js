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
exports.chatHandler = void 0;
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const chatHandler = (socket, io) => {
    socket.on('join-room', (roomId) => {
        console.log("joining room ", roomId);
        socket.join(roomId);
    });
    // socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
    //     io.to(roomId).emit('receive-message', { message, sender: socket.id });
    // });
    socket.on('send-message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, message }) {
        // also save the message to the database
        console.log("roomid , message are ", roomId, message);
        if (!roomId || !message) {
            console.log("roomId, message or senderId is missing");
            return;
        }
        const senderId = socket.user.id;
        console.log("senderId is ", senderId);
        const result = yield chat_model_1.default.findOneAndUpdate({ roomId }, { $push: { messages: { sender: senderId, content: message, timestamp: new Date() } } });
        console.log("result is ", result);
        socket.to(roomId).emit('receive-message', { message, sender: senderId });
    }));
};
exports.chatHandler = chatHandler;
