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
    static homepage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // nearest location from user
                // filters will be location, gender, age, startdate, tripvibe
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid userid' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                console.log("user id is ", user === null || user === void 0 ? void 0 : user.id);
                // console.log(user?.location?.coordinates);
                if (!user) {
                    res.status(400).json({ error: 'user not found' });
                    return;
                }
                // applying aggregation pipeline to fetch start date, end date, tripvibe, description, destination, from trip collection
                // and aboutMe , profilePic, name, gender, age, from user collection
                if (!user || !user.location || !user.location.coordinates) {
                    res.status(400).json({ error: 'User location not found' });
                    return;
                }
                console.log("user location is ", user.location.coordinates);
                const EARTH_RADIUS_IN_METERS = 6378100;
                const maxDistanceInMeters = 1000000;
                // Debug logging
                console.log("Searching for trips within", maxDistanceInMeters, "meters of coordinates:", user.location.coordinates);
                const trips = yield trip_model_1.default.aggregate([
                    {
                        $lookup: {
                            from: "userData",
                            localField: "creator",
                            foreignField: "_id",
                            as: "creator"
                        }
                    },
                    {
                        $unwind: {
                            path: "$creator",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: {
                            "creator.location": {
                                $geoWithin: {
                                    $centerSphere: [user.location.coordinates, maxDistanceInMeters / EARTH_RADIUS_IN_METERS]
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            startDate: 1,
                            endDate: 1,
                            destination: 1,
                            travellingFrom: 1,
                            description: 1,
                            tripVibe: 1,
                            "creator._id": 1,
                            "creator.name": 1,
                            "creator.profilePic": 1,
                            "creator.gender": 1,
                            "creator.age": 1,
                            "creator.aboutMe.personality": 1
                        }
                    }
                ]);
                // Debug logging
                // console.log("Found trips:", trips.length);
                if (trips.length > 0) {
                    console.log("Sample trip creator:", trips[0].creator);
                }
                res.json(trips);
                return;
            }
            catch (error) {
                console.error("Aggregation Error:", error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // static async getUsers(req: Request, res: Response) {
    //     // res.send('Hello World!');
    //     try {
    //         const { place, gender, age = '', language = [], interest = [], personality = [] } = req.body;
    //         // now gender : [ 'Male', 'Female']
    //         // Age : '22 - 28' or ''
    //         // Language : ['English', 'Hindi'] or []
    //         // Interest : ['x', 'y', 'z'] or []
    //         // personalitytype : ['x', 'y', 'z'] or []
    //         if (!place) {
    //             const data = await Trip.find();
    //             res.send(data);
    //             return;
    //         }
    //         const filteredTripData = await Trip.find({ destination: { $regex: place, $options: 'i' } });
    //         const userdata = await User.find({})
    //         const alltrip = await Trip.find({ destination: { $regex: place, $options: 'i' } });
    //         // console.log("All trip", alltrip);
    //         res.send(alltrip);
    //         return;
    //     }
    //     catch (error) {
    //         res.send('Error');
    //         return;
    //     }
    // }
    static createTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // when applying authentication remove creator rather fetch from db
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ error: 'Invalid userid' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(400).json({ error: 'User not found' });
                    return;
                }
                const { destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility, tripVibe, } = req.body;
                if (!destination || !travellingFrom || !startDate || !endDate || !description || !budget || !tripType || !visibility) {
                    res.send('Please fill all the fields');
                    return;
                }
                console.log("user object id is ", user._id);
                const newTrip = new trip_model_1.default({
                    destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility, tripVibe, creator: user._id, participants: [user._id],
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
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userid' });
                    return;
                }
                console.log(userId);
                const user = yield user_model_1.default.findById(userId);
                if (!user) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                res.status(200).json({ message: user });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static createProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, bio, age, gender, personality, travelPreference, lifestyleChoice, physicalInfo, hobbiesInterest, funIcebreakerTag, profilePic, location, languageSpoken, budget, travelStyle } = req.body;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                console.log("user is ", user);
                if (!user) {
                    res.status(404).json({ message: 'user not found' });
                    return;
                }
                user.name = name || user.name;
                user.bio = bio || user.bio;
                user.age = age || user.age;
                user.gender = gender || user.gender;
                // Initialize aboutMe if it doesn't exist
                if (!user.aboutMe) {
                    user.aboutMe = {
                        personality: [],
                        travelPreference: [],
                        lifestyleChoice: [],
                        physicalInfo: [],
                        hobbiesInterest: [],
                        funIcebreakerTag: []
                    };
                }
                user.aboutMe.personality = personality || user.aboutMe.personality;
                user.aboutMe.travelPreference = travelPreference || user.aboutMe.travelPreference;
                user.aboutMe.lifestyleChoice = lifestyleChoice || user.aboutMe.lifestyleChoice;
                user.aboutMe.physicalInfo = physicalInfo || user.aboutMe.physicalInfo;
                user.aboutMe.hobbiesInterest = hobbiesInterest || user.aboutMe.hobbiesInterest;
                user.aboutMe.funIcebreakerTag = funIcebreakerTag || user.aboutMe.funIcebreakerTag;
                user.profilePic = profilePic || user.profilePic;
                user.location = location || user.location;
                user.languageSpoken = languageSpoken || user.languageSpoken;
                user.budget = budget || user.budget;
                user.travelStyle = travelStyle || user.travelStyle;
                yield user.save();
                res.status(200).json({ messsage: "user updated successfully" });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
}
exports.default = UserController;
