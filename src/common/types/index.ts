import { HydratedDocument } from "mongoose";
import { IUser } from "../interface";



export type UserDocument = HydratedDocument<IUser>;