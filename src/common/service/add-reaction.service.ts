import { Types } from "mongoose";
import { AddReactionDTO } from "../dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { BadRequestException, NotFoundException } from "../utils";
import { UserReactionRipository } from "../../DB/models/user-reaction/user-repository";
import { ON_MODEL } from "../enums";


function toModel(collectionName:string) {
    switch (collectionName) {
        case "posts":
            return ON_MODEL.Post;
        case "comments":
            return ON_MODEL.Comment;
    
        default:
            throw new BadRequestException("invalid collection");
    }
}

export const addReaction = async (
    addReactionDTO: AddReactionDTO,
    userId: Types.ObjectId,
    repo: PostRepository|CommentRepository
) => {
        const docExist = await repo.getOne({ _id: addReactionDTO.id });

        if (!docExist) {
            throw new NotFoundException(`${repo.model.modelName} not found`);
    }
    
    const collectionName = docExist.collection.name;
    const userReactionRipository = new UserReactionRipository();

        const userReaction = await userReactionRipository.getOne({
            onModel: toModel(collectionName),
            refId: addReactionDTO.id,
            userId
        })

        if (!userReaction) {
            await userReactionRipository.create({
                onModel: toModel(collectionName),
                refId: addReactionDTO.id,
                userId,
                reaction: addReactionDTO.reaction
            });
            await repo.updateOne(
                { _id: addReactionDTO.id },
                { $inc: { reactionsCount: 1 } }
            );
            return;
        }


        if (userReaction.reaction == addReactionDTO.reaction) {
            await userReactionRipository.deleteOne({ _id: userReaction._id });
            await repo.updateOne(
                { _id: addReactionDTO.id },
                { $inc: { reactionsCount: -1 } }
            );
            return;
        }

        await userReactionRipository.updateOne(
            { _id: userReaction._id },
            { reaction: addReactionDTO.reaction }
        );

        return

}