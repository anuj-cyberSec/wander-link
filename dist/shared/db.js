"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
let isConnected = false;
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        // 🟢 Avoid reconnecting on every function trigger
        console.log('MongoDB already connected');
        return;
    }
    try {
        console.log("Connecting to MongoDB...");
        const client = yield mongoose_1.default.connect(process.env.MONGODB_URI || '', {
        // Optional: Add more connection options if needed
        });
        const db = mongoose_1.default.connection.useDb('wanderLink');
        console.log(`✅ Connected to database: ${db.name}`);
        isConnected = true;
    }
    catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        throw err; // Make sure calling function knows it failed
    }
});
exports.default = connectDb;
