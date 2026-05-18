import z from "zod";
import { BadRequestException, SYS_REACTION } from "../../common";
import { Types } from "mongoose";

export interface CreatePostDTO{
    content?: string;
    attachments?: string[];
}


export const CreatePostSchema = z.object({
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
}).refine((data) => {
    const { content, attachments } = data;
    if (!content && (!attachments || attachments.length == 0)) {
        throw new BadRequestException("content or attachments must be provided");
    }
    return true
})



export interface AddReactionDTO{
    postId: Types.ObjectId;
    reaction: SYS_REACTION;
}