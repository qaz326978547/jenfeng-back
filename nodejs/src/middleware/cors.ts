import cors from "cors";
import { env } from "../config/env";

// Mirrors the previous hand-rolled HandleCors middleware: reflect the
// request Origin only when it's in the allow-list, allow credentials, and
// permit the same method/header set. Requests from disallowed origins are
// still processed (no CORS headers are attached; the browser enforces the
// block), matching the original behaviour.
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || env.CORS_ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  credentials: true,
});
