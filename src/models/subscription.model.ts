import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
interface ISubscription extends Document {
    subscriptionId: string;
    userId: Schema.Types.ObjectId;
    plan: "free" | "premium" | "pro";
    status: "active" | "inactive" | "cancelled";
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    lastPaymentDate?: Date;
    nextBillingDate?: Date;

    addons: {
        swiping: boolean;
        unlimitedMessages: boolean;
        profileBoost: boolean;
        verifiedBadge: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema({
    subscriptionId: { type: String, default: () => uuidv4() },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "premium", "pro"], default: "free" },
    status: { type: String, enum: ["active", "inactive", "cancelled"], default: "inactive" },
    startDate: { type: Date },
    endDate: { type: Date },
    autoRenew: { type: Boolean, default: false },
    lastPaymentDate: { type: Date },
    nextBillingDate: { type: Date },

    addons: {
        swiping: { type: Boolean, default: false },
        unlimitedMessages: { type: Boolean, default: false },
        profileBoost: { type: Boolean, default: false },
        verifiedBadge: { type: Boolean, default: false }
    },
},
    {
        timestamps: true,
        collection: "subscriptionData"
    }
);

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
