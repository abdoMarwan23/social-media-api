import { model, Schema } from "mongoose";
import { IUserFriend, SYS_USER_RELATION } from "../../../common";


const schema = new Schema<IUserFriend>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        friend: { type: Schema.Types.ObjectId, ref: "User", required: true },
        closeFriend: { type: Boolean, default: false },
        relationship:{type:String,enum:SYS_USER_RELATION},
        
    },
    { timestamps: true }
    
)

export const UserFriend = model("UserFriend", schema);