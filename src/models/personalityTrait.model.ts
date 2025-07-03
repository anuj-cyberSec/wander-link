import mongoose, { Schema, Document } from "mongoose";

interface IPersonalityTrait extends Document {
    name: string;
    iconUrl: string;
    category: "personality" | "travelPreference" | "lifestyleChoice";
}

const PersonalityTraitSchema: Schema<IPersonalityTrait> = new Schema({
    name: { type: String, required: true, unique: true },
    iconUrl: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ["personality", "travelPreference", "lifestyleChoice"]
    }
}, {
    timestamps: true,
    collection: "personalityTraits"
});

const PersonalityTrait = mongoose.model<IPersonalityTrait>('PersonalityTrait', PersonalityTraitSchema);

export default PersonalityTrait; 