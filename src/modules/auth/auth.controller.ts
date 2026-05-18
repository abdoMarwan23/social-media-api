import { Router } from "express";
import type{ NextFunction, Request, Response } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware";
import { signupSchema } from "./auth.validation";


const router = Router();


router.post("/signup",isValid(signupSchema) ,async (req: Request, res: Response, next: NextFunction) => {

    await authService.signup(req.body);
    
    return res.status(201).json({
        message: "user created successfully",
        success: true,
    })
    
})


router.post("/verify-account", async (req: Request, res: Response, next: NextFunction) => {

    await authService.verifyAccount(req.body);
    
    return res.status(201).json({
        message: "user verified successfully",
        success: true,
    })
    
});


router.post("/send-otp" ,async (req: Request, res: Response, next: NextFunction) => {

    await authService.sendOTP(req.body);
    
    return res.status(201).json({
        message: "re sent otp successfully",
        success: true,
    })
    
})


router.patch("/reset-password" ,async (req: Request, res: Response, next: NextFunction) => {

    await authService.resetPassword(req.body);
    
    return res.status(201).json({
        message: "reset password successfully",
        success: true,
    })
    
})







export default router;