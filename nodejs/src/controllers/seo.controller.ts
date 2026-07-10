import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Read-only: this backend never writes to `seo` (see prisma/schema.prisma).
export async function index(_req: Request, res: Response): Promise<void> {
  const seo = await prisma.seo.findMany();
  res.json(seo);
}
