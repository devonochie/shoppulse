import dotenv from "dotenv";
import { MONGO_URI } from "./connect";
import mongoose from 'mongoose';

dotenv.config()

mongoose.set('strictQuery', false)

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

const db = mongoose.connect(MONGO_URI)

export default db