import mongoose, {Schema, Document} from "mongoose";
import {v4 as uuidv4} from 'uuid';
// interface ITrip extends Document {

//     tripId : string;
//     creator: string;
//     destination: string;
//     travellingFrom: string;
//     startDate: Date;
//     endDate: Date;
//     description: string;
//     participants: [string];
//     status: string;
//     createdAt: Date;
//     budget: string;
//     tripType : string;
//     visibility : string;   
//     maxParticipants: number;
    
// }
// const TripSchema: Schema<ITrip> = new Schema({
//     tripId: { type: String, default: uuidv4 },
//     creator: { type: String, required: true },
//     destination: { type: String, required: true },
//     travellingFrom: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     description: { type: String },
//     participants: { type: [String] },
//     status: { type: String, enum: ['Open', 'Closed'] , default: 'Open'},
//     createdAt: { type: Date, default: Date.now },
//     budget : {
//         type: String,
//         enum: ['Low', 'Medium', 'High']
//     },
//     tripType: {
//         type: String,
//         enum: ['Backpacking', 'Luxury', 'Solo', 'Group']
//     },
//     visibility: {
//         type: String,
//         enum: ['Public', 'Private']
//     },
//     // maxParticipants: { type: Number }
// }
// , { collection: "tripData" });

// const Trip = mongoose.model<ITrip>("Trip", TripSchema);
// export default Trip;



interface ITrip extends Document {
    tripId: string;
    creator: Schema.Types.ObjectId;  // Refers to the User who created the trip
    destination: string;
    travellingFrom: string;
    startDate: Date;
    endDate: Date;
    description: string;
    // tripVibe : 
    participants: Schema.Types.ObjectId[];  // Array of User ObjectIds
    requests: { userId: Schema.Types.ObjectId, status: "pending" | "approved" | "declined" }[]; // Join requests
    status: "Open" | "Closed";
    budget: "Low" | "Medium" | "High";
    tripType: "Backpacking" | "Luxury" | "Solo" | "Group";
    visibility: "Public" | "Private";
    maxParticipants: number;
    createdAt: Date;
    updatedAt: Date;
}

const TripSchema: Schema<ITrip> = new Schema(
    {
        tripId: { type: String, default: () => uuidv4() },
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        destination: { type: String, required: true, index: true },
        travellingFrom: { type: String, required: true },
        startDate: { type: Date, required: true, index: true },
        endDate: { type: Date, required: true },
        description: { type: String, maxlength: 500 },
        participants: [{ type: Schema.Types.ObjectId, ref: "User" }],  // Array of user IDs
        requests: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
            }
        ],
        status: { type: String, enum: ["Open", "Closed"], default: "Open" },
        budget: { type: String, enum: ["Low", "Medium", "High"], required: true },
        tripType: { type: String, enum: ["Backpacking", "Luxury", "Solo", "Group"], required: true },
        visibility: { type: String, enum: ["Public", "Private"], required: true },
        maxParticipants: { type: Number, min: 1, default: 10 },  // Default max participants to 10
    },
    { 
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: "tripData"
    }
);

const Trip = mongoose.model<ITrip>("Trip", TripSchema);
export default Trip;
