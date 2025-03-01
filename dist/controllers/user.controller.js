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
const user_model_1 = __importDefault(require("../models/user.model"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
class UserController {
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // res.send('Hello World!');
            try {
                const { place, gender, age = '', language = [], interest = [], personality = [] } = req.body;
                // now gender : [ 'Male', 'Female']
                // Age : '22 - 28' or ''
                // Language : ['English', 'Hindi'] or []
                // Interest : ['x', 'y', 'z'] or []
                // personalitytype : ['x', 'y', 'z'] or []
                if (!place) {
                    const data = yield trip_model_1.default.find();
                    res.send(data);
                    return;
                }
                const filteredTripData = yield trip_model_1.default.find({ destination: { $regex: place, $options: 'i' } });
                const userdata = yield user_model_1.default.find({});
                const alltrip = yield trip_model_1.default.find({ destination: { $regex: place, $options: 'i' } });
                // console.log("All trip", alltrip);
                res.send(alltrip);
                return;
            }
            catch (error) {
                res.send('Error');
                return;
            }
        });
    }
    static createTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // when applying authentication remove creator rather fetch from db
                const { creator, destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility } = req.body;
                if (!creator || !destination || !travellingFrom || !startDate || !endDate || !description || !budget || !tripType || !visibility) {
                    res.send('Please fill all the fields');
                    return;
                }
                const newTrip = new trip_model_1.default({
                    creator, destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility
                });
                yield newTrip.save();
                res.send('Trip created successfully');
                return;
            }
            catch (error) {
                res.send('Error');
                return;
            }
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, profilePic, bio, age, gender, personality, interest } = req.body;
                if (!name || !profilePic || !bio || !age || !gender || !personality || !interest) {
                    res.send('Please fill all the fields');
                    return;
                }
                const newUser = new user_model_1.default({
                    name, profilePic, bio, age, gender, personality, interest
                });
                yield newUser.save();
                res.send('User created successfully');
                return;
            }
            catch (error) {
                res.send('Error');
                return;
            }
        });
    }
}
exports.default = UserController;
