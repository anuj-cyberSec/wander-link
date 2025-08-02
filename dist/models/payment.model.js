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
const PaymentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    paymentId: { type: String, default: () => (0, uuid_1.v4)() },
    subscriptionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Subscription", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["USD", "EUR", "INR"], default: "INR" },
    status: { type: String, enum: ["successful", "failed", "pending"], default: "pending" },
    paymentGateway: { type: String, enum: ["stripe", "paypal", "credit_card"], required: true },
    transactionId: { type: String, required: true },
}, {
    timestamps: true,
    collection: "paymentData"
});
const Payment = mongoose_1.default.model("Payment", PaymentSchema);
exports.default = Payment;
