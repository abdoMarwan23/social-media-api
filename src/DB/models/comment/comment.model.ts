import { model, Schema } from "mongoose";
import { IComment } from "../../../common";



const schema = new Schema<IComment>(
    {
        userId:{type:Schema.Types.ObjectId,ref:"User",required:true},
        postId:{type:Schema.Types.ObjectId,ref:"Post",required:true},
        parentId:{type:Schema.Types.ObjectId,ref:"Comment"},
        mentions: { type: Schema.Types.ObjectId, ref: "User" },
        
        content: String,
        attachment: String,

        reactionsCount:{type:Number,default:0}
        
    },
    { timestamps: true }
)


export const Comment = model("Comment", schema);