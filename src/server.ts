import {Request, Response} from 'express';
import cors from 'cors';
import express from 'express';
import connectDb from './db';
import userRouter from './routes/user.route';

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
connectDb();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/backend', userRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});