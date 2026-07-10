import express, { type Express } from "express";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { apiRouter } from "./routes";

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(corsMiddleware);
  app.use("/v2", apiRouter);
  app.use(errorHandler);
  return app;
}
