// Must run before any other setup file or test imports src/config/env.ts
// (which reads process.env at import time), so this file has no other
// imports of its own.
import { config } from "dotenv";

config({ path: ".env.test" });
