import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 8080),

  DATABASE_URL: required("DATABASE_URL"),

  REDIS_HOST: process.env.REDIS_HOST ?? "127.0.0.1",
  REDIS_PORT: Number(process.env.REDIS_PORT ?? 6379),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",

  MAIL_HOST: process.env.MAIL_HOST ?? "",
  MAIL_PORT: Number(process.env.MAIL_PORT ?? 587),
  MAIL_USERNAME: process.env.MAIL_USERNAME ?? "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD ?? "",
  MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION ?? "tls",
  MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS ?? "",
  MAIL_FROM_NAME: process.env.MAIL_FROM_NAME ?? "JINFENG",
  // Matches the destination address that was hardcoded in the original
  // Laravel ContactController::store().
  RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL ?? "a0930532215@gmail.com",

  CORS_ALLOWED_ORIGINS: (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
