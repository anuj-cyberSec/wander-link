import {Server} from 'socket.io';
import {chatHandler} from './handlers/chat.handler';

export const server =  (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins
            methods: ['GET', 'POST'], // Allowed HTTP methods
            allowedHeaders: ['Content-Type'], // Allowed headers
            credentials: true, // Allow credentials
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
