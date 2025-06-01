import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

interface IUser extends Document {
    userId: string;
    profileCompleted: boolean;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    otp: string;
    otpExpiry: Date;
    auth_provider: string;
    social_id: string;
    designation?: string;
    bio?: string;
    age?: number;
    gender?: "Male" | "Female" | "Other";
    aboutMe?: {
        personality: Array<{
            name: string;
            iconUrl: string;
        }>;
        travelPreference: Array<{
            name: string;
            iconUrl: string;
        }>;
        lifestyleChoice: Array<{
            name: string;
            iconUrl: string;
        }>;
        physicalInfo: Array<{
            name: string;
            value: number;
            iconUrl: string;
        }>;
        hobbiesInterest: Array<{
            name: string;
            iconUrl: string;
        }>;
        funIcebreakerTag: Array<{
            name: string;
            iconUrl: string;
        }>;
        
    };
    profilePic?: string[]; // Array to store multiple profile picture URLs
    location?: {
        type: "Point";
        coordinates: [number, number];  // [longitude, latitude]
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
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
    profileCompleted: {type: Boolean, default: false},
    name: { type: String, /*required: true*/ },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    auth_provider: { type: String, required: true },
    social_id: { type: String,/* required: true*/ },
    designation: { type: String },
    bio: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    // aboutMe: {
    //     personality: [{
    //         name: {
    //             type: String,
    //             enum: ["Introvert", "Extrovert", "Ambivert", "Empath", "Chill Vibes", "Social Butterfly"]
    //         },
    //         iconUrl: { type: String }
    //     }],
    //     travelPreference: [{
    //         name: {
    //             type: String,
    //             enum: ["Group Explorer", "Planned Itineraies", "Road Tripper", "Nature Lover", "History Buff", "Culture Seeker", "Beach Bum", "Mountain Soul", "Budget Traveler", "Luxury Lover", "Passport Ready"]
    //         },
    //         iconUrl: { type: String }
    //     }],
    //     lifestyleChoice: [{
    //         name: {
    //             type: String,
    //             enum: ["Smoker", "Non-Smoker", "Vegan/Vegetarian", "Fitness Freak", "Night Owl", "Early Bird", "Party Animal", "Sober Traveller", "Occasional Drinker"]
    //         },
    //         iconUrl: { type: String }
    //     }],
    //     physicalInfo: [{
    //         name: {
    //             type: String,
    //             enum: ["Height", "Body Type",  ]
    //         },
    //         value: { type: String },
    //         iconUrl: { type: String }
    //     }],
    //     hobbiesInterest: [{
    //         name: {
    //             type: String,
    //             enum: ["Loves Driving","Music Lover","Bookworm","Foodie","Dancer","Gamer","Yoga Enthusiast","Meditation","Cycling","Vlogging / Content Creation","Photography","Camping"]
    //         },
    //         iconUrl: { type: String }
    //     }],
    //     funIcebreakerTag: [{
    //         name: {
    //             type: String,
    //             enum: ["Always Down to Explore","Never Says No to Coffee","Carries Snacks Always","Can Sleep Anywhere","Travel DJ","Map Reader","The Planner Friend","Chill Companion","Loves Deep Conversations"]
    //         },
    //         iconUrl: { type: String }
    //     }],
        
    // },

    aboutMe: {
        personality: [{
            name: {
                type: String,
                enum: ["Adventurer", "Planner", "Explorer", "Relaxer", "Social Butterfly", "Budget Traveller", "Digital Nomad", "Trekking", "Night Owl", "Luxury Lover", "Star Gazing", "Photographer", "Spontaneous"]
            },
            iconUrl: { type: String }
        }],
        travelPreference: [{
            name: {
                type: String,
                enum: ["Group Explorer", "Planned Itineraies", "Road Tripper", "Nature Lover", "History Buff", "Culture Seeker", "Beach Bum", "Mountain Soul", "Budget Traveler", "Luxury Lover", "Passport Ready"]
            },
            iconUrl: { type: String }
        }],
        lifestyleChoice: [{
            name: {
                type: String,
                enum: ["Yes, I drink", "Non drinker", "Occasionally", "Yes, I smoke", "Non smoker", "Sometimes"]
            },
            iconUrl: { type: String }
        }],
        physicalInfo: [{
            name: {
                type: String,
                enum: ["Height", "Body Type",  ]
            },
            value: { type: String },
            iconUrl: { type: String }
        }],
        hobbiesInterest: [{
            name: {
                type: String,
                enum: ["Loves Driving","Music Lover","Bookworm","Foodie","Dancer","Gamer","Yoga Enthusiast","Meditation","Cycling","Vlogging / Content Creation","Photography","Camping"]
            },
            iconUrl: { type: String }
        }],
        funIcebreakerTag: [{
            name: {
                type: String,
                enum: ["Always Down to Explore","Never Says No to Coffee","Carries Snacks Always","Can Sleep Anywhere","Travel DJ","Map Reader","The Planner Friend","Chill Companion","Loves Deep Conversations"]
            },
            iconUrl: { type: String }
        }],
        
    },

profilePic: {type: Array, default: []}, // Array to store multiple profile picture URLs
location: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number], index: "2dsphere" }
},
address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String }
},
// trips: { type: [String] },
tripIds: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
    languageSpoken: { type: [String] },
budget: { type: String, enum: ["Low", "Medium", "High"] },
travelStyle: { type: String, enum: ["Backpacking", "Luxury", "Solo", "Group"] },

subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
paymentIds: [{ type: Schema.Types.ObjectId, ref: "Payment" }],
    
    
}, {
    timestamps: true,
        collection: "userData"
}
);


const User = mongoose.model<IUser>('User', UserSchema);

export default User;
