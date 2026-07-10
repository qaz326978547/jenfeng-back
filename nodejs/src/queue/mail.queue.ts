import { Queue, Worker, type Job } from "bullmq";
import { env } from "../config/env";
import { sendSignedUpMail, type SignedUpMailData } from "../mail/signedUpMail";

const QUEUE_NAME = "mail";

// bullmq bundles its own ioredis version, which is a structurally
// incompatible type from our top-level `ioredis` package — pass plain
// connection options instead of a shared client instance so bullmq manages
// its own connection.
const connection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
};

export const mailQueue = new Queue(QUEUE_NAME, { connection });

export async function enqueueSignedUpMail(data: SignedUpMailData): Promise<void> {
  await mailQueue.add("signedUp", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}

export function startMailWorker(): Worker {
  return new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      await sendSignedUpMail(job.data as SignedUpMailData);
    },
    { connection },
  );
}
