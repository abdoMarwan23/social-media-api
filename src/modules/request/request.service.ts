import { Types } from "mongoose";
import { requestRepository, RequestRepository } from "../../DB/models/request/request.repository";
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common";
import { userFriendRepository, UserFriendRepository } from "../../DB/models/user-friend/user-friend.repository";




class RequestService {
    constructor(
        private readonly requestRepository: RequestRepository,
        private readonly userFriendRepository: UserFriendRepository

    ) { }
    


    async sendRequest(senderId: Types.ObjectId, recevierId: Types.ObjectId) {

        if(senderId.toString() == recevierId.toString())throw new BadRequestException("you are not allowed to send request to yourself")

        const userFriendExist = await this.userFriendRepository.getOne({
            $or: [
                { user: senderId, friend: recevierId },
                { user: recevierId, friend: senderId },
                
            ]
        });

        if (userFriendExist) throw new BadRequestException("you are already friends");

        const requestExist = await this.requestRepository.getOne({
            $or: [
                { sender: senderId, recevier: recevierId },
                { sender: recevierId, recevier: senderId }
            ]
        })

        if (requestExist) throw new ConflictException("request already exist");

        return await this.requestRepository.create({
            sender: senderId,
            recevier:recevierId
        })

    }

    async acceptRequest(userId: Types.ObjectId, id: Types.ObjectId) {
        const requestExist = await this.requestRepository.getOne({ _id: id });
        if (!requestExist) throw new NotFoundException("request not found");

        if (!requestExist.recevier.equals(userId)) throw new UnAuthorizedException("you are not authorized");

        await this.requestRepository.deleteOne({ _id: id });

        await this.userFriendRepository.create({
            user: userId,
            friend: requestExist.sender,
            
        })
    }



    async declineRequest(userId: Types.ObjectId, id: Types.ObjectId) {
        const requestExist = await this.requestRepository.getOne({ _id: id });
        if (!requestExist) throw new NotFoundException("request not found");

        //requestExist.recevier.equals(userId) && !requestExist.sender.equals(userId)
        if (![requestExist.recevier.toString() , requestExist.sender.toString()].includes(userId.toString())) throw new UnAuthorizedException("you are not authorized");

        await this.requestRepository.deleteOne({ _id: id });

    }


    async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
        // const userFriendExist = await this.userFriendRepository.getOne({
        //     $or: [
        //         {user:userId,friend:friendId},
        //         {user:friendId,friend:userId},
        //     ]
        // });
        // if (!userFriendExist) throw new BadRequestException("you are not friends");

        // //requestExist.recevier.equals(userId) && !requestExist.sender.equals(userId)

        // await this.userFriendRepository.deleteOne({ _id: userFriendExist._id });

        const { deletedCount } = await this.userFriendRepository.deleteOne({
            $or: [
                { user: userId, friend: friendId },
                { user: friendId, friend: userId },
            ]
        });

        if(deletedCount == 0)throw new BadRequestException("you are not friends");

    }


};


export default new RequestService(requestRepository,userFriendRepository);