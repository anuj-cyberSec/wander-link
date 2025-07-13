export const chatHandler = (socket: any, io: any) => {
    socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
    });
    // socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
    //     io.to(roomId).emit('receive-message', { message, sender: socket.id });
    // });
    socket.on('send-message', ({roomId, message}: {roomId: string; message: string}) => {
        socket.to(roomId).emit('receive-message', { message, sender: socket.id });
    });
    
}