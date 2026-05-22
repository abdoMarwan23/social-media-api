import { Types } from "mongoose";


export interface IRequest{
    sender: Types.ObjectId;
    recevier: Types.ObjectId;
}