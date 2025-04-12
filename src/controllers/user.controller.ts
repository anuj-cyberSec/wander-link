import { Request, Response } from 'express';
import User from '../models/user.model';
import Trip from '../models/trip.model';
import { maxHeaderSize } from 'http';

class UserController {

    static async homepage(req: Request, res: Response) {
        try {
            // nearest location from user
            // filters will be location, gender, age, startdate, tripvibe
            const userId = (req as any).user.id;
            if (!userId) {
                res.status(400).json({ error: 'Invalid userid' });
                return;
            }
            const user = await User.findById(userId);
            console.log("user id is ", user?.id);
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

            const trips = await Trip.aggregate([
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

    static async createTrip(req: Request, res: Response) {
        try {
            // when applying authentication remove creator rather fetch from db
            const userId = (req as any).user.id;
            if (!userId) {
                res.status(400).json({ error: 'Invalid userid' });
                return;
            }
            const user = await User.findById(userId);
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
            const newTrip = new Trip({
                destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility, tripVibe, creator: user._id, participants: [user._id],
            });
            await newTrip.save();
            res.send('Trip created successfully');
            return;
        }
        catch (error) {
            res.send('Error');
            return;
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const { name, profilePic, bio, age, gender, personality, interest } = req.body;
            if (!name || !profilePic || !bio || !age || !gender || !personality || !interest) {
                res.send('Please fill all the fields');
                return;
            }
            const newUser = new User({
                name, profilePic, bio, age, gender, personality, interest
            });
            await newUser.save();
            res.send('User created successfully');
            return;
        }
        catch (error) {
            res.send('Error');
            return;
        }
    }

    static async getProfile(req: Request, res: Response) {
        try {

            const userId = (req as any).user.id;
            if (!userId) {
                res.send('Invalid userid');
                return;
            }

            console.log(userId);
            const user = await User.findById(userId);
            if (!user) {
                res.send('user not found');
                return;
            }

            res.send(user);
            return;

        }
        catch (error) {
            res.send('Error');
            return;
        }
    }

    // static async updateProfile(req: Request, res: Response) {
    //     try {
    //         const userId = (req as any).user.id;
    //         if (!userId) {
    //             res.send('Invalid userId');
    //             return;
    //         }

    //         const { name, bio, age, gender, personality, interest, profilePic, languageSpoken } = req.body;

    //         const user = await User.findById(userId);
    //         if (!user) {
    //             res.send('user not found');
    //             return;
    //         }

    //         // update profile, if any field is not present, keep it as it is
    //         user.name = name || user.name;
    //         user.bio = bio || user.bio;
    //         user.age = age || user.age
    //         user.gender = gender || user.gender;
    //         // user.personality = personality || user.personality;
    //         // user.interest = interest || user.interest;
    //         user.profilePic = profilePic || user.profilePic;
    //         user.languageSpoken = languageSpoken || user.languageSpoken;

    //         await user.save();


    //         // user?.updateOne({
    //         //     name,
    //         //     bio,
    //         //     age,
    //         //     gender,
    //         //     personality,
    //         //     interest,
    //         //     profilePic,
    //         //     languageSpoken
    //         // })

    //         // user?.save();
    //         res.send('profile updated');
    //         return;


    //     }
    //     catch (error) {
    //         // console.log('error is ', error);
    //         res.send('Internal server error');
    //         return;
    //     }
    // }
}

export default UserController;