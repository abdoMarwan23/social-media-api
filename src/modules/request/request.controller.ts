import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import requestService from "./request.service";



const router = Router();


router.post("/:recevierId",async (req: Request, res: Response, next: NextFunction) => {
    await requestService.sendRequest(
        new Types.ObjectId("69ee49e38a18c3be5d672fbd"),
        new Types.ObjectId(req.params.recevierId as string)
    );

    return res.sendStatus(204);
})


router.post("/accept/:id",async (req: Request, res: Response, next: NextFunction) => {
    await requestService.acceptRequest(
        new Types.ObjectId("6a10a997e1db070d6d71b8d8"),
        new Types.ObjectId(req.params.id as string)
    );

    return res.sendStatus(204);
})

router.delete("/decline/:id",async (req: Request, res: Response, next: NextFunction) => {
    await requestService.declineRequest(
        new Types.ObjectId("6a10a997e1db070d6d71b8d8"),
        new Types.ObjectId(req.params.id as string)
    );

    return res.sendStatus(204);
})


router.delete("/remove/:friendId",async (req: Request, res: Response, next: NextFunction) => {
    await requestService.removeFriend(
        new Types.ObjectId("6a10a997e1db070d6d71b8d8"),
        new Types.ObjectId(req.params.friendId as string)
    );

    return res.sendStatus(204);
})


export default router;