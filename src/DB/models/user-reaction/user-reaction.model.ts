import { model, Schema } from "mongoose";
import { IUserReaction } from "../../../common/interface/user-reaction.interface";
import { ON_MODEL, SYS_REACTION } from "../../../common";





const schema = new Schema<IUserReaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        refId: { type: Schema.Types.ObjectId, refPath: "onModel", required: true },
        onModel: { type: String, enum: ON_MODEL, required: true },
        reaction: { type: Number, enum: SYS_REACTION, default: SYS_REACTION.like },
    },
    { timestamps: true }

);


export const UserReaction = model("UserReaction", schema);