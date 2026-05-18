import { NextFunction, Request, Response, Router } from "express";
import  postService  from "./post.service";
import { Types } from "mongoose";
import { isValid } from "../../middleware";
import { CreatePostSchema } from "./post.dto";
import { default as commentRouter } from "../comment/comment.controller";



const router = Router();

router.use("/:postId/comment", commentRouter);


router.post("/",isValid(CreatePostSchema) ,async (req: Request, res: Response, next: NextFunction) => {
    const createdPost = await postService.create(req.body, new Types.ObjectId("69ee49e38a18c3be5d672fbd"));

    return res.status(201).json({
        message: "post created successfully",
        success: true,
        data:{createdPost}
    })
})

router.post("/reaction" ,async (req: Request, res: Response, next: NextFunction) => {
    await postService.addReaction(req.body, new Types.ObjectId("69ee49e38a18c3be5d672fbd"));

    return res.sendStatus(204);
})







export default router;