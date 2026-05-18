import { Types } from "mongoose";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { PostRepository } from "../../DB/models/post/post.repository";
import { CreateCommentDTO } from "./comment.dto";
import { NotFoundException } from "../../common";




class CommentService{
    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository, 
    ) { }
    
    async create(createCommentDTO: CreateCommentDTO, params: any, userId: Types.ObjectId) {
        if (params.postId) {
            const postExist = await this.postRepository.getOne({ _id: params.postId });
            if (!postExist) throw new NotFoundException("post not found");
        }


        let parentCommentExist = undefined;
        if (params.parentId) {
            parentCommentExist = await this.commentRepository.getOne({ _id: params.parentId });
            if (!parentCommentExist) throw new NotFoundException("comment not found");
        };

        return await this.commentRepository.create({
            ...createCommentDTO,
            ...params,
            userId,
            postId:params.postId || parentCommentExist?.postId,
        });

    }


    async getAll(params:any) {
        const comments = await this.commentRepository.getAll({ postId: params.postId, parentId: params.parentId });

        if (comments.length == 0) throw new NotFoundException("no comments");

        return comments;
    }
}



export default new CommentService(new PostRepository(), new CommentRepository());