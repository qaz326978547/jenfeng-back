import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";
import { redis } from "../lib/redis";

export interface AuthUser {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface AppJwtPayload {
  sub: number;
  email: string;
  isAdmin: boolean;
  jti: string;
  exp: number;
}

export function signToken(user: AuthUser): string {
  const jti = randomUUID();
  return jwt.sign(
    { sub: user.id, email: user.email, isAdmin: user.isAdmin, jti },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
}

export function verifyToken(token: string): AppJwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as unknown as AppJwtPayload;
}

const BLOCKLIST_PREFIX = "jwt:blocklist:";

/** Emulates Passport's token()->revoke() for our stateless JWTs. */
export async function revokeToken(jti: string, exp: number): Promise<void> {
  const ttlSeconds = Math.max(exp - Math.floor(Date.now() / 1000), 1);
  await redis.set(BLOCKLIST_PREFIX + jti, "1", "EX", ttlSeconds);
}

export async function isTokenRevoked(jti: string): Promise<boolean> {
  const value = await redis.get(BLOCKLIST_PREFIX + jti);
  return value !== null;
}
