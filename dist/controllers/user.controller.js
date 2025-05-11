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
const user_model_1 = __importDefault(require("../models/user.model"));
const trip_model_1 = __importDefault(require("../models/trip.model"));
const swipe_model_1 = __importDefault(require("../models/swipe.model"));
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
                res.status(200).json(trips);
                return;
            }
            catch (error) {
                console.error("Aggregation Error:", error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // static async homepage(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.status(400).json({ error: 'Invalid userid' });
    //             return;
    //         }
    //         const user = await User.findById(userId);
    //         console.log("user id is ", user?.id);
    //         if (!user || !user.location || !user.location.coordinates) {
    //             res.status(400).json({ error: 'User location not found' });
    //             return;
    //         }
    //         console.log("user location is ", user.location.coordinates);
    //         const maxDistanceInMeters = 1000000;
    //         // Step 1: Find nearby users first
    //         const nearbyUsers = await User.find({
    //             location: {
    //                 $near: {
    //                     $geometry: {
    //                         type: "Point",
    //                         coordinates: user.location.coordinates
    //                     },
    //                     $maxDistance: maxDistanceInMeters
    //                 }
    //             }
    //         }).select('_id');
    //         console.log(`Found ${nearbyUsers.length} nearby users`);
    //         // Step 2: Get the IDs of nearby users
    //         const nearbyUserIds = nearbyUsers.map(u => u._id);
    //         // Step 3: Find trips created by these users
    //         const trips = await Trip.aggregate([
    //             {
    //                 $match: {
    //                     creator: { $in: nearbyUserIds }
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: "userData",
    //                     localField: "creator",
    //                     foreignField: "_id",
    //                     as: "creator"
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$creator",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     startDate: 1,
    //                     endDate: 1,
    //                     destination: 1,
    //                     travellingFrom: 1,
    //                     description: 1,
    //                     tripVibe: 1,
    //                     "creator._id": 1,
    //                     "creator.name": 1,
    //                     "creator.profilePic": 1,
    //                     "creator.gender": 1,
    //                     "creator.age": 1,
    //                     "creator.aboutMe.personality": 1
    //                 }
    //             }
    //         ]);
    //         console.log(`Found ${trips.length} trips from nearby users`);
    //         res.status(200).json(trips);
    //     }
    //     catch (error) {
    //         console.error("Aggregation Error:", error);
    //         res.status(500).json({ error: 'Internal server error' });
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
                const { name, profilePic, designation, bio, age, gender, personality, travelPreference, lifestyleChoice, physicalInfo, hobbiesInterest, funIcebreakerTag, location, languageSpoken, budget, travelStyle } = req.body;
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
                const updateData = {};
                if (name !== undefined && name !== "")
                    updateData.name = name;
                if (profilePic !== undefined && profilePic !== "")
                    updateData.profilePic = profilePic;
                if (designation !== undefined && designation !== "")
                    updateData.designation = designation;
                if (bio !== undefined && bio !== "")
                    updateData.bio = bio;
                if (age !== undefined && age !== "")
                    updateData.age = age;
                if (gender !== undefined && gender !== "")
                    updateData.gender = gender;
                if ((location === null || location === void 0 ? void 0 : location.type) === "Point" && Array.isArray(location === null || location === void 0 ? void 0 : location.coordinates) && (location === null || location === void 0 ? void 0 : location.coordinates.length) === 2) {
                    updateData.location = {
                        type: "Point",
                        coordinates: location.coordinates
                    };
                }
                if (Array.isArray(languageSpoken) && languageSpoken.length > 0) {
                    updateData.languageSpoken = languageSpoken;
                }
                if (budget !== undefined && budget !== "")
                    updateData.budget = budget;
                if (travelStyle !== undefined && travelStyle !== "")
                    updateData.travelStyle = travelStyle;
                // aboutMe nested structure — only set if arrays are non-empty
                if (Array.isArray(personality) && personality.length > 0) {
                    updateData["aboutMe.personality"] = personality;
                }
                if (Array.isArray(travelPreference) && travelPreference.length > 0) {
                    updateData["aboutMe.travelPreference"] = travelPreference;
                }
                if (Array.isArray(lifestyleChoice) && lifestyleChoice.length > 0) {
                    updateData["aboutMe.lifestyleChoice"] = lifestyleChoice;
                }
                if (Array.isArray(physicalInfo) && physicalInfo.length > 0) {
                    updateData["aboutMe.physicalInfo"] = physicalInfo;
                }
                if (Array.isArray(hobbiesInterest) && hobbiesInterest.length > 0) {
                    updateData["aboutMe.hobbiesInterest"] = hobbiesInterest;
                }
                if (Array.isArray(funIcebreakerTag) && funIcebreakerTag.length > 0) {
                    updateData["aboutMe.funIcebreakerTag"] = funIcebreakerTag;
                }
                if (Object.keys(updateData).length === 0) {
                    res.status(400).send("No valid fields to update.");
                    return;
                }
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, updateData, {
                    new: true,
                });
                if (!updatedUser) {
                    res.status(404).send("User not found");
                    return;
                }
                res.status(200).json({ message: "User updated successfully", user: updatedUser });
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
                const sanitizedUser = user.toObject();
                delete sanitizedUser.password;
                res.status(200).json({ message: sanitizedUser });
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
    static bulkswiped(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsArray = req.body.data;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const user = yield user_model_1.default.findById(userId);
                // console.log("user is ", user);
                console.log("ids array are", idsArray);
                if (!user) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                if (!Array.isArray(idsArray) || idsArray.length === 0) {
                    res.status(400).json({ message: "Invalid input format" });
                }
                const formatted = idsArray.map((s) => ({
                    swiper: s.swiper,
                    target: s.target,
                    direction: s.direction,
                    creator: user._id,
                    createdAt: s.createdAt || new Date()
                }));
                const result = yield swipe_model_1.default.insertMany(formatted, { ordered: false });
                res.status(201).json({ message: "Batch swipe saved", saved: result.length });
                return;
            }
            catch (error) {
                res.status(500).json({ message: "Failed to save Batch swipes" });
                return;
            }
        });
    }
    // static async lastSwipe(req: Request, res: Response) {
    //     try{
    //         const userId = (req as any).user.id;
    //         if(!userId){
    //             res.status(400).json({message:'Invalid userId'});
    //             return;
    //         }
    //         // fetching last swipe from swipe collection and then deleting that last swipe when swipe back is used
    //         const lastswipe = await Swipe.findOne({swiper:userId})
    //             .sort({createdAt: -1})
    //             .populate("target");
    //         if(!lastswipe){
    //             res.status(400).json({message:'No last swipe found'});
    //             return;
    //         }
    //         if(lastswipe){
    //             await Swipe.deleteOne({_id: lastswipe._id});
    //         }
    //         // just like homepage api we need to return data
    //         // popolate target with trip collection and creator with user collection
    //         res.status(200).json({message: lastswipe});
    //         return;
    //     }
    //     catch(error){
    //         res.status(500).json({message: 'Internal Server Error'});
    //         return;
    //     }
    // }
    // fetch a user(his homepage trip) based on objectid
    static lastSwipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // Fetch the last swipe whose approved do not exist or approved is false and populate the target (Trip) and creator (User)
                const lastswipe = yield swipe_model_1.default.findOne({
                    swiper: userId,
                    $or: [
                        { accepted: { $exists: false } }, // No accepted field
                        { accepted: false } // accepted is false
                    ]
                })
                    .sort({ createdAt: 1 })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    populate: {
                        path: 'creator', // Populate the creator of the trip (User)
                        select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    }
                });
                if (!lastswipe) {
                    res.status(400).json({ message: 'No last swipe found' });
                    return;
                }
                // Optionally, delete the swipe if you're handling swipe-back behavior
                yield swipe_model_1.default.deleteOne({ _id: lastswipe._id });
                // Create the response in the same format as homepage API
                const response = {
                    _id: lastswipe._id,
                    swiper: lastswipe.swiper,
                    target: lastswipe.target, // The populated target (Trip) with the creator's data
                    direction: lastswipe.direction,
                    createdAt: lastswipe.createdAt,
                    __v: lastswipe.__v
                };
                // Return the response with the populated trip and creator
                res.status(200).json({ message: response });
                return;
            }
            catch (error) {
                console.error("Error in lastSwipe:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static fetchTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripId = req.body.id;
                if (!tripId) {
                    console.log("No userid found");
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                const homepageUserdata = yield trip_model_1.default.aggregate([
                    {
                        $match: {
                            _id: new mongoose_1.default.Types.ObjectId(tripId) // Ensure tripId is casted properly
                        }
                    },
                    {
                        $lookup: {
                            from: 'users', // Correct collection name for users
                            localField: 'creator',
                            foreignField: '_id',
                            as: 'creator'
                        }
                    },
                    {
                        $unwind: {
                            path: '$creator',
                            preserveNullAndEmptyArrays: true
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
                            'creator._id': 1,
                            'creator.name': 1,
                            'creator.profilePic': 1,
                            'creator.gender': 1,
                            'creator.age': 1,
                            'creator.aboutMe.personality': 1
                        }
                    }
                ]);
                console.log("homepage user data is ", homepageUserdata);
                res.status(200).json(homepageUserdata);
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    // now this api will fetch all those trip(homepage like) which this user has swiped and creator has approved
    static fetchApprovedTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // fetching all the swipes of this user whose approved is true
                const swipes = yield swipe_model_1.default.find({ swiper: userId, accepted: true })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    populate: {
                        path: 'creator', // Populate the creator of the trip (User)
                        select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    }
                })
                    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                console.log("swipes are ", swipes);
                if (!swipes || swipes.length === 0) {
                    res.status(400).json({ message: 'No swipes found' });
                    return;
                }
                const response = swipes.map((swipe) => ({
                    _id: swipe._id,
                    swiper: swipe.swiper,
                    target: swipe.target, // The populated target (Trip) with the creator's data
                }));
                res.status(200).json({ response });
                return;
            }
            catch (error) {
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    // this api --> the user's trip which others have swiped will be shown here so that user can approve or reject
    static fetchTripForApproval(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                // console.log("user id is ", userId);
                // now search with user._id in swipe collection and should not include approved false and then populate target with trip collection and swiper with user collection
                const swipes = yield swipe_model_1.default.find({ creator: userId, direction: "right", accepted: { $exists: false }, })
                    .populate({
                    path: 'target', // Populate the target (which is a Trip)
                    // populate: {
                    //     path: 'creator', // Populate the swiper of the trip (User)
                    //     select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                    // }
                })
                    .populate({
                    path: 'swiper', // Populate the swiper (User)
                    select: 'name profilePic gender age aboutMe' // Select the fields you need from User
                })
                    .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                console.log("swipes are ", swipes);
                if (!swipes || swipes.length === 0) {
                    res.status(400).json({ message: 'No swipes found' });
                    return;
                }
                const response = swipes.map((swipe) => ({
                    _id: swipe._id,
                    swiper: swipe.swiper,
                    target: swipe.target, // The populated target (Trip) with the creator's data
                }));
                res.status(200).json({ message: response });
                return;
            }
            catch (error) {
                console.error("Error in fetchTripForApproval:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
    static approveTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // api to approve trip and also store that swiper from swipe to trip participants
            try {
                const tripObjectId = req.body.tripObjectId; //it is actually swipe object id
                const approval = req.body.approval;
                const userId = req.user.id;
                if (!userId) {
                    res.status(400).json({ message: 'Invalid userId' });
                    return;
                }
                if (!tripObjectId || typeof approval !== 'boolean') {
                    res.status(400).json({ message: 'Invalid tripObjectId or approval' });
                    return;
                }
                // update swipe collection with accepted true and fetch swiper id and then update trip collection with participants
                const swipe = yield swipe_model_1.default.findByIdAndUpdate(tripObjectId, { accepted: approval }, { new: true });
                if (!swipe) {
                    res.status(400).json({ message: 'Swipe not found' });
                    return;
                }
                const tripId = swipe.target;
                const swiperId = swipe.swiper;
                // update trip collection with participants
                const trip = yield trip_model_1.default.findByIdAndUpdate(tripId, { $addToSet: { participants: swiperId } }, { new: true });
                if (!trip) {
                    res.status(400).json({ message: 'Trip not found' });
                    return;
                }
                res.status(200).json({ message: 'Trip approved successfully' });
                return;
            }
            catch (error) {
                console.error("Error in approveTrip:", error);
                res.status(500).json({ message: 'Internal Server Error' });
                return;
            }
        });
    }
}
exports.default = UserController;
