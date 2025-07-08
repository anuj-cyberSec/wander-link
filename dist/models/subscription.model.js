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
const SubscriptionSchema = new mongoose_1.Schema({
    subscriptionId: { type: String, default: () => (0, uuid_1.v4)() },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
}, {
    timestamps: true,
    collection: "subscriptionData"
});
const Subscription = mongoose_1.default.model("Subscription", SubscriptionSchema);
exports.default = Subscription;
