import { Request, Response } from 'express';
import User from '../models/user.model';
import Trip from '../models/trip.model';

class UserController {
    static async getUsers(req: Request, res: Response) {
        // res.send('Hello World!');
        try {
            const {place, gender, age = '', language = [], interest = [], personality = []} = req.body;

            // now gender : [ 'Male', 'Female']
            // Age : '22 - 28' or ''
            // Language : ['English', 'Hindi'] or []
            // Interest : ['x', 'y', 'z'] or []
            // personalitytype : ['x', 'y', 'z'] or []
            if (!place) {
                const data = await Trip.find();
                res.send(data);
                return;
            }

            const filteredTripData = await Trip.find({destination : { $regex : place, $options : 'i' }});

            const userdata = await User.find({})

            const alltrip = await Trip.find({ destination: { $regex: place, $options: 'i' } });

            // console.log("All trip", alltrip);

            res.send(alltrip);
            return;
        }
        catch (error) {
            res.send('Error');
            return;
        }
    }

    static async createTrip(req: Request, res: Response) {
        try {
            // when applying authentication remove creator rather fetch from db
            const { creator, destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility } = req.body;
            if (!creator || !destination || !travellingFrom || !startDate || !endDate || !description || !budget || !tripType || !visibility) {
                res.send('Please fill all the fields');
                return;
            }
            const newTrip = new Trip({
                creator, destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility
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
            console.log(userId);
            const user = await User.findById(userId);
            res.send(user);
            return;

        }
        catch (error) {
            res.send('Error');
            return;
        }
    }
}

export default UserController;