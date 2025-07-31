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
exports.default = default_1;
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const db_1 = __importDefault(require("../../shared/db")); // assume this connects Mongoose
function default_1(context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.default)(); // Ensure DB connection
        // Create fake Express-like req/res
        const res = {
            status: (code) => {
                context.res = Object.assign(Object.assign({}, context.res), { status: code });
                return res;
            },
            send: (body) => {
                context.res = Object.assign(Object.assign({}, context.res), { body });
            },
            json: (body) => {
                context.res = Object.assign(Object.assign({}, context.res), { body });
            },
        };
        // Call the controller method
        yield auth_controller_1.default.login(req, res);
    });
}
