import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

const CACHE_KEY = "faq";
const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours, matching Cache::remember('faq', 60 * 24, ...)

// Read-only: this backend never writes to `faq` (see prisma/schema.prisma).
// Only id/name/info/no are projected, matching the original controller's
// ->map() — the underlying table has many more columns owned by another
// CMS system sharing this database.
export async function index(_req: Request, res: Response): Promise<void> {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    res.json(JSON.parse(cached));
    return;
  }

  const faqs = await prisma.faq.findMany({
    select: { id: true, name: true, info: true, no: true },
    orderBy: { no: "desc" },
  });

  await redis.set(CACHE_KEY, JSON.stringify(faqs), "EX", CACHE_TTL_SECONDS);
  res.json(faqs);
}
