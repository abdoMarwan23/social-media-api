import z from "zod";
import { SYS_GENDER } from "../enums";



export const generalFields = {
    userName: z.string({message:"userName is required"}).min(2).max(20),
    email: z.email({message:"email is required"}),
    password: z.string({message:"password is required"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    phoneNumber: z.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/),
    gender: z.enum(SYS_GENDER).optional(),
};