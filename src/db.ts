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
        // connect with database named wanderLink using uri
        // const db = client.connection.useDb('wanderLink');
        // console.log(`Connected to database: ${db.name}`);

        console.log('Database connected');  
        // now connecting with wanderLink database
        const db = mongoose.connection.useDb('wanderLink');
        console.log(`Connected to database: ${db.name}`);
        console.log("current db ", mongoose.connection.name)
        // check total collections in the database
        // const collections = await db.db.listCollections().toArray();
        // console.log('Total collections in the database:', collections.length);
        // // list all collections in the database
        // console.log('Collections in the database:');
        // collections.forEach((collection) => {
        //     console.log(collection.name);
        // });
    }
    catch(err){
        console.error(err);
    }
}

// connectDb();
export default connectDb;
