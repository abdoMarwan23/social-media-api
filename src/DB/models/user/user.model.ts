import { model, Schema } from "mongoose";
import { IUser, SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../../../common";





const schema = new Schema<IUser>(
    {
        userName: { type: String, required: true, minLength: 2, maxLength: 20 },
        email: { type: String, required: true },
        phoneNumber: { type: String },
        password: {
            type: String,
            required: function () {
                if (this.provider == SYS_PROVIDER.google) return false;
                return true;
            }
        },
        role: { type: Number, enum: SYS_ROLE, default: SYS_ROLE.user },
        provider: { type: Number, enum: SYS_PROVIDER, default: SYS_PROVIDER.system },
        gender: { type: Number, enum: SYS_GENDER },
        
    },
    { timestamps: true })




export const User = model<IUser>("User", schema);