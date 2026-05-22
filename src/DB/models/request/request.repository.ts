import { IRequest } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { RequestModel } from "./request.model";

export class RequestRepository extends AbstractRepository<IRequest>{
    constructor() {
        super(RequestModel);
    }
}


export const requestRepository = new RequestRepository();