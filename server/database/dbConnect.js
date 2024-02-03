import mongoose from "mongoose";
import { mongodb_url } from "../config/index.js";

export async function dbConnect() {
    try {
        const conn = await mongoose.connect(mongodb_url);
        console.log(`Database is connected to host: ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
    }
}