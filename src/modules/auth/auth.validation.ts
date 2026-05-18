import z from "zod";
import { generalFields, SYS_GENDER } from "../../common";


export const signupSchema = z.object({
    userName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    phoneNumber: generalFields.phoneNumber,
    gender: generalFields.gender,
}).strict();

