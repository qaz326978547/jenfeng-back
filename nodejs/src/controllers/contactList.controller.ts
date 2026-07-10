import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Original ContactListController only ever implemented index()/show() —
// store/update/destroy exist commented-out in the source and were never
// wired to a route (CreateContactListRequest::authorize() even hardcodes
// false, confirming this was abandoned).
export async function index(_req: Request, res: Response): Promise<void> {
  const data = await prisma.contactList.findMany();
  res.status(200).json({ data });
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const found = await prisma.contactList.findUnique({ where: { id } });
  if (!found) {
    res.status(404).json({ message: "找不到資料" });
    return;
  }
  res.json(found);
}
