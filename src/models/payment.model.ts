import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
interface IPayment extends Document {
    userId: Schema.Types.ObjectId;
    paymentId: string;
    subscriptionId: Schema.Types.ObjectId;
    amount: number;
    currency: "USD" | "EUR" | "INR";
    status: "successful" | "failed" | "pending";
    paymentGateway: "stripe" | "paypal" | "credit_card";
    transactionId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: String, default: () => uuidv4() },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["USD", "EUR", "INR"], default: "INR" },
    status: { type: String, enum: ["successful", "failed", "pending"], default: "pending" },
    paymentGateway: { type: String, enum: ["stripe", "paypal", "credit_card"], required: true },
    transactionId: { type: String, required: true },
},
    {
        timestamps: true,
        collection: "paymentData"
    }
);

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;

