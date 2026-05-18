import mongoose from "mongoose";
import { DB_URL } from "../config";


export function connectDB() {

    mongoose
        .connect(DB_URL)
        .then(()=>console.log("DB connected successfuly"))
        .catch((err) => { console.log("DB failed to be connected") });
}