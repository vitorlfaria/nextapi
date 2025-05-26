import redis from "@/lib/redis";
import { Worker } from "bullmq";

const worker = new Worker(
    "logTimeQueue",
    async () => {
        console.log(`Current time: ${new Date().toISOString()}`);
    },
    {
        connection: redis,
    }
);

worker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`Job failed: ${job?.id} with error: ${err.message}`);
});