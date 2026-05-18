import express, { NextFunction, Request, Response } from "express";
import { authRouter, commentRouter, postRouter } from "./modules";
import { BadRequestException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";


export function bootstrap() {
    const app = express();
    const port = 3000;


    connectDB();
    redisConnect();



    app.use(express.json());


    //routing app

    app.use("/auth", authRouter);
    app.use("/post", postRouter);
    app.use("/comment", commentRouter);




    app.use(
        (error: Error, req: Request, res: Response, next: NextFunction) => {
            return res.status((error.cause as number) || 500).json({
                message: error.message,
                success: false,
                details: error instanceof BadRequestException ? error.details : undefined,
            });
        }
    );





    app.listen(port, () => {
        console.log("app is runnin on port ", port);
        
    })
}