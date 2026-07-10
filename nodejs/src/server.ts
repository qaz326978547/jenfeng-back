import { createApp } from "./app";
import { env } from "./config/env";
import { startMailWorker } from "./queue/mail.queue";

const app = createApp();
const mailWorker = startMailWorker();

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

async function shutdown(): Promise<void> {
  await mailWorker.close();
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());
