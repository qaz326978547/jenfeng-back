import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createContactClassSchema } from "../validators/contact.validators";

export async function index(_req: Request, res: Response): Promise<void> {
  const data = await prisma.contactClass.findMany({
    where: { del: false },
    orderBy: { no: "desc" },
  });
  res.json(data);
}

export async function store(req: Request, res: Response): Promise<void> {
  const data = createContactClassSchema.parse(req.body);
  const created = await prisma.contactClass.create({ data: { name: data.name, no: data.no } });
  res.status(201).json({ message: "新增成功", data: created });
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const found = await prisma.contactClass.findFirst({ where: { id, del: false } });
  if (!found) {
    res.status(404).json({ message: "找不到資料" });
    return;
  }
  res.json(found);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.contactClass.findFirst({ where: { id, del: false } });
  if (!existing) {
    res.status(404).json({ message: "找不到資料" });
    return;
  }

  const data = createContactClassSchema.parse(req.body);
  const updated = await prisma.contactClass.update({
    where: { id },
    data: { name: data.name, no: data.no },
  });
  res.status(200).json({ message: "更新成功", data: updated });
}

// Bulk (ids: number[]) or single (ids: number) hard delete — matches the
// original ContactClassController::destroy(), which despite the `del`
// column, performs a real Eloquent delete rather than a soft delete.
export async function destroy(req: Request, res: Response): Promise<void> {
  const { ids } = req.body as { ids?: number | number[] };

  if (Array.isArray(ids)) {
    const existing = await prisma.contactClass.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((row) => row.id));
    const nonExisting = ids.filter((id) => !existingIds.has(id));

    if (nonExisting.length > 0) {
      res.status(404).json({ message: `以下的 id 不存在: ${nonExisting.join(", ")}` });
      return;
    }

    await prisma.contactClass.deleteMany({ where: { id: { in: ids } } });
    res.status(200).json({ message: "刪除成功" });
    return;
  }

  const id = Number(ids);
  const found = await prisma.contactClass.findUnique({ where: { id } });
  if (!found) {
    res.status(404).json({ message: `找不到 id: ${ids}` });
    return;
  }

  await prisma.contactClass.delete({ where: { id } });
  res.status(200).json({ message: "刪除成功" });
}
