import z from "zod";
import { signupSchema } from "./auth.validation";

// export interface SignupDTO{
//     userName:string,
//     email: string,
//     password: string,
//     phoneNumber: string,
//     gender:SYS_GENDER,
// }


export type SignupDTO = z.infer<typeof signupSchema>;


export interface LoginDTO{
    email: string,
    password: string,
}


export interface VerifyAccountDTO{
    otp: string;
    email:string
}



export interface ResetPasswordDTO{
    otp:string,
    email: string,
    newPassword:string,
}

export interface RestPasswordDTO{
    password: string,
    otp:string,
    email: string,
}