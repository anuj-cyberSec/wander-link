import express, {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { auth } from 'firebase-admin';

dotenv.config({ path: path.join(__dirname, '../../.env') });
const secret = process.env.JWT_SECRET as string;
if (!secret) {
    throw new Error('JWT_SECRET is missing');
}

const authentication = (req: Request, res: Response, next: NextFunction):void => {
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).send('Access Denied');
        return ;
    }
    try {
        const verified = jwt.verify(token, secret);
        console.log(verified);
        (req as any).user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
        return ;
    }
}

export default authentication;

