import {Server} from 'socket.io';
import {chatHandler} from './handlers/chat.handler';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET as string;
export const server =  (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins
            methods: ['GET', 'POST'], // Allowed HTTP methods
            allowedHeaders: ['Content-Type'], // Allowed headers
            credentials: true, // Allow credentials
        }
    })
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if(!token){
            return next(new Error('Authentication error'));
        }
        
        try{
            const user: string | jwt.JwtPayload = jwt.verify(token, secret);
            (socket as any).user = user;
            next();
        }
        catch(err){
            next(new Error('Authentication error'));
        }
    })

    io.on('connection', (socket: any) => {
        console.log('A user connected:', socket.id);
        chatHandler(socket,io);
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    })
}
