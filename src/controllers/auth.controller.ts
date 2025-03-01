import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import User from '../models/user.model';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET as string;
if(!secret){

    throw new Error('JWT_SECRET is missing');
}
console.log(secret);
const serviceAccount = require('../../wanderconnect-740ef-firebase-adminsdk-fbsvc-08730ac6dd.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// google sign in

const verifyGoogleToken = async (token: string) => {
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch(error){
        console.log(error);

        
    }
}


class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const {email, name, photo } = req.body;
            

            if(!email || !name || !photo){
                res.send('Please provide email, name and photo');
                return;
            }
            let user = await User.findOne({email: email});
            if(!user){
                user = new User({
                    name: name,
                    email: email,
                    profilePic: photo,
                    
                })
                await user.save();
            }
            const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '10d' });
            res.send({token, user});
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send('Error');
            return;
        }

    }

}

export default AuthController;