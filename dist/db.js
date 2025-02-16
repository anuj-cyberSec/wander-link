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
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const 
        // console.log('Loading .env file from:', path.resolve(__dirname, '../.env'));
        console.log("***************");
        console.log(process.env.MONGODB_URI);
        const client = yield mongoose_1.default.connect(process.env.MONGODB_URI || '');
        // connect with database named wanderLink
        console.log('Database connected');
    }
    catch (err) {
        console.error(err);
    }
});
// connectDb();
exports.default = connectDb;
