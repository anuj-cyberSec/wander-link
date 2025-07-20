import { timeStamp } from "console";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";
export const chatHandler = (socket: any, io: any) => {
    socket.on('join-room', (roomId: string) => {
        console.log("joining room ", roomId);
        socket.join(roomId);
    });
    // socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
    //     io.to(roomId).emit('receive-message', { message, sender: socket.id });
    // });
    socket.on('send-message', async({roomId, message}: {roomId: string; message: string}) => {
        // also save the message to the database
        console.log("roomid , message are ", roomId, message);
        if(!roomId || !message ) {
            console.log("roomId, message or senderId is missing");
            return;
        }
        const senderId = (socket as any).user.id;
        console.log("senderId is ", senderId);  
        const result = await Chat.findOneAndUpdate(
            {roomId},
            {$push:{messages: {sender: senderId, content: message, timestamp: new Date()}}}
        )
        console.log("result is ", result);
        socket.to(roomId).emit('receive-message', { message, sender: senderId });
    });
    
}
