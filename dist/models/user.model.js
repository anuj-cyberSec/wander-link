"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.Schema({
    userId: { type: String, default: () => (0, uuid_1.v4)() },
    name: { type: String, /*required: true*/ },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    auth_provider: { type: String, required: true },
    social_id: { type: String, /* required: true*/ },
    bio: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    aboutMe: {
        personality: [{
                name: {
                    type: String,
                    enum: ["Introvert", "Extrovert", "Ambivert", "Empath", "Chill Vibes", "Social Butterfly"]
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
                    enum: ["Smoker", "Non-Smoker", "Vegan/Vegetarian", "Fitness Freak", "Night Owl", "Early Bird", "Party Animal", "Sober Traveller", "Occasional Drinker"]
                },
                iconUrl: { type: String }
            }],
        physicalInfo: {
            name: {
                type: String,
                enum: ["Height", "Body Type"]
            },
            value: { type: Number },
            iconUrl: { type: String }
        },
        hobbiesInterest: {
            name: {
                type: String,
                enum: ["Loves Driving", "Music Lover", "Bookworm", "Foodie", "Dancer", "Gamer", "Yoga Enthusiast", "Meditation", "Cycling", "Vlogging / Content Creation", "Photography", "Camping"]
            },
            iconUrl: { type: String }
        },
        funIcebreakerTag: {
            name: {
                type: String,
                enum: ["Always Down to Explore", "Never Says No to Coffee", "Carries Snacks Always", "Can Sleep Anywhere", "Travel DJ", "Map Reader", "The Planner Friend", "Chill Companion", "Loves Deep Conversations"]
            },
            iconUrl: { type: String }
        }
    },
    profilePic: { type: String },
    location: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number], index: "2dsphere" }
    },
    // trips: { type: [String] },
    tripIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Trip" }],
    languageSpoken: { type: [String] },
    budget: { type: String, enum: ["Low", "Medium", "High"] },
    travelStyle: { type: String, enum: ["Backpacking", "Luxury", "Solo", "Group"] },
    subscriptionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subscription" },
    paymentIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" }],
}, {
    timestamps: true,
    collection: "userData"
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
