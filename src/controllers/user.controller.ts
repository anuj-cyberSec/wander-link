import { Request, Response } from 'express';
import User from '../models/user.model';
import Trip from '../models/trip.model';

class UserController {
    static async getUsers(req: Request, res: Response) {
        // res.send('Hello World!');
        try {
            const place = req.body.place;
            if(!place){
                const data = await Trip.find();
                res.send(data);
                return;
            }
            const alltrip = await Trip.find({destination: {$regex: place, $options: 'i'}});
            console.log("All trip", alltrip);
            res.send(alltrip);
            return;
        }
        catch(error){
            res.send('Error');
            return;
        }
    }

    static async createTrip(req: Request, res: Response) {
        try{
            const {creator, destination, travellingFrom, startDate, endDate, description, budget, tripType, visibility} = req.body;
            if(!creator || !destination || !travellingFrom || !startDate || !endDate || !description || !budget || !tripType || !visibility ){
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
        catch(error){
            res.send('Error');
            return;
        }
    }
}

export default UserController;