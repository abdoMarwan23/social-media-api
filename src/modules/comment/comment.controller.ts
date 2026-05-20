import { NextFunction, Request, Response, Router } from "express";
import commentService from "./comment.service";
import { Types } from "mongoose";
import { addReaction } from "../../common";
import { commentRepo } from "../../DB/models/comment/comment.repository";


const router = Router({mergeParams:true});


router.post("/add-reaction", async (req: Request, res: Response, next: NextFunction) => {
    await addReaction(req.body, new Types.ObjectId("69ee49e38a18c3be5d672fbd"),commentRepo);

    res.sendStatus(204);
})


router.post("{/:parentId}", async (req: Request, res: Response, next: NextFunction) => {
    await commentService.create(req.body, req.params, new Types.ObjectId("69ee49e38a18c3be5d672fbd"));
    
    res.sendStatus(204);
})


router.get("/:postId{/:parentId}", async (req: Request, res: Response, next: NextFunction) => {
    const comments = await commentService.getAll(req.params);
    
    res.status(200).json({success:true,data:comments});
})



router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    await commentService.delete(
        new Types.ObjectId(req.params.id as string),
        new Types.ObjectId("69ee49e38a18c3be5d672fbd")
        
    )

    return res.sendStatus(204);
})








export default router;