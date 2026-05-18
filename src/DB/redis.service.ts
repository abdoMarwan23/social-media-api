import { redisClient } from "./redis.connect";

export async function setIntoCash(key:string,value:string|number,timeToExpire:number) {
    redisClient.set(key, value, { EX: timeToExpire });
}


export async function getFromCash(key:string) {
    return redisClient.get(key);
}

export async function deleteFromCash(key:string) {
    return redisClient.del(key);
}