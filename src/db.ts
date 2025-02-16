import mongoose from 'mongoose';
import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const connectDb = async() => {
    try{
        // const 
        // console.log('Loading .env file from:', path.resolve(__dirname, '../.env'));

        console.log("***************")
        console.log(process.env.MONGODB_URI);
        const client = await mongoose.connect(process.env.MONGODB_URI || '');
        // connect with database named wanderLink
        

       

        console.log('Database connected');
    }
    catch(err){
        console.error(err);
    }
}

// connectDb();
export default connectDb;
