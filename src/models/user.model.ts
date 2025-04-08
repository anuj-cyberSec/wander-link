import mongoose,{Schema, Document}  from "mongoose";
import {v4 as uuidv4} from 'uuid';

interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    otp: string;
    auth_provider: string;
    social_id: string;
    bio?: string;
    age?: number;
    gender?: "Male" | "Female" | "Other";
    personality?: "Introvert" | "Extrovert" | "Adventurous";
    interest?: string[];
    profilePic?: string;
    location?: {
        type: "Point";
        coordinates: [number, number];  // [longitude, latitude]
    };
    tripIds?: Schema.Types.ObjectId[];
    languageSpoken?: string[];
    budget?: "Low" | "Medium" | "High";
    travelStyle?: "Backpacking" | "Luxury" | "Solo" | "Group";
    
    subscriptionId?: Schema.Types.ObjectId; // Linked to Subscription Collection
    paymentIds?: Schema.Types.ObjectId[];   // Linked to Payment Collection
    
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    userId: { type: String, default: () => uuidv4() },
    name: { type: String, /*required: true*/ },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    auth_provider: { type: String, required: true }, 
    social_id: { type: String,/* required: true*/ },
    bio: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    personality: { type: String, enum: ["Introvert", "Extrovert", "Adventurous"] },
    interest: { type: [String] },
    profilePic: { type: String },
    location: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number], index: "2dsphere" }
    },
    // trips: { type: [String] },
    tripIds: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    languageSpoken: { type: [String] },
    budget: { type: String, enum: ["Low", "Medium", "High"] },
    travelStyle: { type: String, enum: ["Backpacking", "Luxury", "Solo", "Group"] },
    
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    paymentIds: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    
    
},{
    timestamps: true,
    collection: "userData"
}
);


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
