const {Redis}=require('ioredis');

const redis=new Redis(
    "rediss://default:AUj7AAIncDE0MTY5NzZhN2QzNTI0NTZhODJkZjE2ZWI4NjI2OGRjY3AxMTg2ODM@bold-troll-18683.upstash.io:6379"
);

redis.on("connect", () => console.log("Redis connected"));

module.exports=redis;