import logTimeQueue from "@/queues/logTimeQueue"


(async () => {
    await logTimeQueue.add(
        "logTimeJob",
        {},
        {
            repeat: {
                every: 10000,
            }
        }
    );
    console.log("Scheduled logTimeJob to run every 10 seconds");
})();