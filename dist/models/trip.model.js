"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const uuid_1 = require("uuid");
const TripSchema = new mongoose_1.Schema({
    tripId: { type: String, default: () => (0, uuid_1.v4)() },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String, required: true, index: true },
    travellingFrom: { type: String, required: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    description: { type: String, maxlength: 500 },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    requests: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
        }
    ],
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    budget: { type: String, enum: ["Low", "Medium", "High"], required: true },
    tripType: { type: String, enum: ["Backpacking", "Luxury", "Solo", "Group"], required: true },
    visibility: { type: String, enum: ["Public", "Private"], required: true },
    maxParticipants: { type: Number, min: 1, default: 10 },
    tripVibe: [{
            name: {
                type: String, enum: ["Beach Vacation", "Mountain", "City Break / Urban Exploration", "Cultural & Historical Tour", "Trekking / Hiking Trip", "Luxury Resort Stay", "Cruise Vacation", "Road Trip", "Backpacking Adventure", "Wildlife Safari", "Skiing / Snowboarding Trip", "Spa & Wellness Retreat", "Island Hopping", "Festival or Event Travel ", "Food & Culinary Tour", "Pilgrimage / Spiritual Journey", "Eco-Tourism / Nature Immersion", "Digital Detox / Off-the-Grid Escape", "Cycling Tour", "Surfing Trip", "Volunteer Travel / “Voluntourism”", "Business Trip", "Digital Nomad / Workcation", "Family Vacation", "Romantic Getaway / Honeymoon", "Art or Creative Retreat", "Solo Travel Adventure", "Group Tour Package", "Train Journey / Scenic Railway Trip"],
                iconUrl: {
                    type: String
                }
            }
        }],
}, {
    timestamps: true,
    collection: "tripData"
});
const Trip = mongoose_1.default.model("Trip", TripSchema);
exports.default = Trip;
