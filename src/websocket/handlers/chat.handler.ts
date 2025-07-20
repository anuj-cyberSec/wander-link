import { timeStamp } from "console";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";
export const chatHandler = (socket: any, io: any) => {
    socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
    });
    // socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
    //     io.to(roomId).emit('receive-message', { message, sender: socket.id });
    // });
    socket.on('send-message', async({roomId, message}: {roomId: string; message: string}) => {
        // also save the message to the database
        await Chat.findOneAndUpdate(
            {roomId},
            {$push:{messages: {sender: socket.id, content: message, timestamp: new Date()}}}
        )
        socket.to(roomId).emit('receive-message', { message, sender: socket.id });
    });
    
}