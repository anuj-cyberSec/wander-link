import {Request, Response} from 'express';
import cors from 'cors';
import express from 'express';
import connectDb from './db';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
// allow 5mb file uploads
app.use(express.urlencoded({extended: true, limit: '5mb'}));
connectDb();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/backend/users', userRouter);
app.use('/backend/auth', authRouter);
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});