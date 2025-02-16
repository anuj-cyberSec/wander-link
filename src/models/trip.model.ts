import mongoose, {Schema, Document} from "mongoose";

interface ITrip extends Document {
    creator: string;
    destination: string;
    travellingFrom: string;
    startDate: Date;
    endDate: Date;
    description: string;
    participants: [string];
    status: string;
    createdAt: Date;
    budget: string;
    tripType : string;
    visibility : string;   
    maxParticipants: number;
    
}
const TripSchema: Schema<ITrip> = new Schema({
    creator: { type: String, required: true },
    destination: { type: String, required: true },
    travellingFrom: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    participants: { type: [String] },
    status: { type: String, enum: ['Open', 'Closed'] , default: 'Open'},
    createdAt: { type: Date, default: Date.now },
    budget : {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    tripType: {
        type: String,
        enum: ['Backpacking', 'Luxury', 'Solo', 'Group']
    },
    visibility: {
        type: String,
        enum: ['Public', 'Private']
    },
    // maxParticipants: { type: Number }
}
, { collection: "tripData" });

const Trip = mongoose.model<ITrip>("Trip", TripSchema);
export default Trip;