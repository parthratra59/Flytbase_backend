import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const dbConnect = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {})
        .then(() => {
        console.log("Database connected successfully");
    })
        .catch((err) => {
        console.log("db connection issue");
        console.error(err);
        process.exit(1);
    });
};
