import mongoose,{Schema, Document}  from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    bio: string;
    age: number;
    gender : string;
    personality : string;
    interest : [string];
    profilePic : string;
    location: {
        type: string;
        coordinates: [number];
    };
    trips : [string];
    // chat : [chats];
    createdAt : Date;
    updatedAt : Date;
    languageSpoken: [string];
    budget: string;
    travelStyle : string;
}
const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    age: { type: Number },
    gender: { type: String },
    personality: { type: String, enum: ['Introvert', 'Extrovert', 'Adventurous'] },
    interest: { type: [String] },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    trips: { type: [String] },
    profilePic: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    languageSpoken: { type: [String] },
    budget : {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    travelStyle: {
        type: String,
        enum: ['Backpacking', 'Luxury', 'Solo', 'Group']
    }
});

const User = mongoose.model<IUser>('userData', UserSchema, 'userData');

export default User;
