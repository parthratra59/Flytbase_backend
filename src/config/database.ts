import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = (): void => {
  mongoose
    .connect(process.env.MONGODB_URI as string, {  })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err: string) => {
      console.log("db connection issue");
      console.error(err);
      process.exit(1);
    });
};
