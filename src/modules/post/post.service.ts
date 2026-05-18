import { Types } from "mongoose";
import { PostRepository } from "../../DB/models/post/post.repository";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { NotFoundException, ON_MODEL } from "../../common";
import { UserReactionRipository } from "../../DB/models/user-reaction/user-repository";






export class PostService{
    constructor(
        private readonly postRepository: PostRepository,
        private readonly userReactionRipository: UserReactionRipository
    ) { }
    
    async create(createPostDTO: CreatePostDTO,userId:Types.ObjectId) {
        return await this.postRepository.create({ ...createPostDTO, userId });
    }

    async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
        const postExist = await this.postRepository.getOne({ _id: addReactionDTO.postId });

        if (!postExist) {
            throw new NotFoundException("post not found");
        }

        const userReaction = await this.userReactionRipository.getOne({
            onModel: ON_MODEL.Post,
            refId: addReactionDTO.postId,
            userId
        })

        if (!userReaction) {
            await this.userReactionRipository.create({
                onModel: ON_MODEL.Post,
                refId: addReactionDTO.postId,
                userId,
                reaction: addReactionDTO.reaction
            });
            await this.postRepository.updateOne(
                { _id: addReactionDTO.postId },
                { $inc: { reactionsCount: 1 } }
            );
            return;
        }


        if (userReaction.reaction == addReactionDTO.reaction) {
            await this.userReactionRipository.deleteOne({ _id: userReaction._id });
            await this.postRepository.updateOne(
                { _id: addReactionDTO.postId },
                { $inc: { reactionsCount: -1 } }
            );
            return;
        }

        await this.userReactionRipository.updateOne(
            { _id: userReaction._id },
            { reaction: addReactionDTO.reaction }
        );

        return

    }


}


export default new PostService(new PostRepository(),new UserReactionRipository());