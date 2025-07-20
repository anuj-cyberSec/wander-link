import mongoose, {Schema, Document} from "mongoose";

interface IChat extends Document {
    roomId: string;
    participants: Schema.Types.ObjectId[];  // Array of User IDs
    messages: {
        sender: Schema.Types.ObjectId;  // User ID of the sender
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
}

const chatSchema = new Schema<IChat>({
    roomId: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
