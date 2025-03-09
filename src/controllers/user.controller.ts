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
            if(!userId){
                res.send('Invalid userid');
                return;
            }

            console.log(userId);
            const user = await User.findById(userId);
            if(!user){
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

    static async updateProfile(req: Request, res: Response){
        try{
            const userId = (req as any).user.id;
            if(!userId){
                res.send('Invalid userId');
                return;
            }

            const {name, bio, age, gender, personality, interest, profilePic, languageSpoken} = req.body;
            
            const user = await User.findById(userId);
            if(!user){
                res.send('user not found');
                return;
            }

            // update profile, if any field is not present, keep it as it is
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.age = age || user.age
            user.gender = gender || user.gender;
            user.personality = personality || user.personality;
            user.interest = interest || user.interest;
            user.profilePic = profilePic || user.profilePic;
            user.languageSpoken = languageSpoken || user.languageSpoken;

            await user.save();
            

            // user?.updateOne({
            //     name,
            //     bio,
            //     age,
            //     gender,
            //     personality,
            //     interest,
            //     profilePic,
            //     languageSpoken
            // })

            // user?.save();
            res.send('profile updated');
            return;

            
        }
        catch(error){
            // console.log('error is ', error);
            res.send('Internal server error');
            return;
        }
    }
}

export default UserController;