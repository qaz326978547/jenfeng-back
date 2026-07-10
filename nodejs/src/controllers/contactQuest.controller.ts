import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { buildPaginatedResponse, parsePage } from "../utils/paginate";

// Read-only: the original ContactQuestController only ever implemented
// index() — store/update/destroy exist commented-out in the source and were
// never wired to a route.
export async function index(req: Request, res: Response): Promise<void> {
  const page = parsePage(req.query.page);
  const perPage = 10;

  const [data, total] = await Promise.all([
    prisma.contactQuest.findMany({
      where: { del: false },
      orderBy: { no: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contactQuest.count({ where: { del: false } }),
  ]);

  res.json(buildPaginatedResponse(data, total, page, perPage, req.originalUrl.split("?")[0]!));
}
