import redis from "@/lib/redis";
import { Queue } from "bullmq";

const logTimeQueue = new Queue("logTimeQueue", {
    connection: redis,
});

export default logTimeQueue;