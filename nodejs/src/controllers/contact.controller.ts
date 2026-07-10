import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createContactSchema } from "../validators/contact.validators";
import { buildPaginatedResponse, parsePage } from "../utils/paginate";
import { enqueueSignedUpMail } from "../queue/mail.queue";

export async function store(req: Request, res: Response): Promise<void> {
  const data = createContactSchema.parse(req.body);

  const created = await prisma.contact.create({
    data: {
      class: data.class,
      quest: data.quest,
      company: data.company,
      tel: data.tel,
      num: data.num,
      last5: data.last5 ?? null,
      ticket: data.ticket ?? null,
      ticketName: data.ticket_name ?? null,
      ticketNo: data.ticket_no ?? null,
      ticketAddress: data.ticket_address ?? null,
      from: data.from ?? null,
      suggestName: data.suggest_name ?? null,
      contactList: {
        create: data.contactList.map((item) => ({
          name: item.name,
          email: item.email,
          job: item.job ?? null,
          cel: item.cel,
        })),
      },
    },
    include: { contactList: true },
  });

  // Fire-and-forget via BullMQ, mirroring the original Mail::queue() call.
  await enqueueSignedUpMail({
    company: data.company,
    class: data.class,
    num: data.num,
    tel: data.tel,
  });

  res.status(201).json({ message: "新增成功", data: created });
}

export async function index(req: Request, res: Response): Promise<void> {
  const page = parsePage(req.query.page);
  const perPage = 10;

  const [data, total] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contact.count(),
  ]);

  res.json(buildPaginatedResponse(data, total, page, perPage, req.originalUrl.split("?")[0]!));
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const found = await prisma.contact.findUnique({
    where: { id },
    include: { contactList: true },
  });
  if (!found) {
    res.status(404).json({ message: "找不到資料" });
    return;
  }
  res.json(found);
}

// Fixes a bug in the original ContactController::update(), which read
// $data['name']/$data['no'] — keys that CreateContactRequest never
// produces (it validates class/quest/company/tel/num/...), so the endpoint
// always threw. This now actually updates the validated Contact fields.
export async function update(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "找不到資料" });
    return;
  }

  const data = createContactSchema.parse(req.body);
  const updated = await prisma.contact.update({
    where: { id },
    data: {
      class: data.class,
      quest: data.quest,
      company: data.company,
      tel: data.tel,
      num: data.num,
      last5: data.last5 ?? null,
      ticket: data.ticket ?? null,
      ticketName: data.ticket_name ?? null,
      ticketNo: data.ticket_no ?? null,
      ticketAddress: data.ticket_address ?? null,
      from: data.from ?? null,
      suggestName: data.suggest_name ?? null,
    },
  });

  res.status(200).json({ message: "更新成功", data: updated });
}

// Bulk (ids: number[]) or single (ids: number) hard delete, mirroring the
// original DB::table('contact')->delete(). The original never cascaded to
// contact_list (the migration's FK never actually took effect on the
// MyISAM-engined tables), which left orphaned contact_list rows behind with
// no endpoint able to ever clean them up. relationMode="prisma" refuses a
// delete that would orphan a required relation, so — rather than reproduce
// the orphaning bug — we explicitly delete the related contactList rows
// first. This is a deliberate improvement, not a straight port.
export async function destroy(req: Request, res: Response): Promise<void> {
  const { ids } = req.body as { ids?: number | number[] };

  if (Array.isArray(ids)) {
    const existing = await prisma.contact.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((row: { id: number }) => row.id));
    const nonExisting = ids.filter((id) => !existingIds.has(id));

    if (nonExisting.length > 0) {
      res.status(404).json({ message: `以下的 id 不存在: ${nonExisting.join(", ")}` });
      return;
    }

    await prisma.contactList.deleteMany({ where: { cid: { in: ids } } });
    await prisma.contact.deleteMany({ where: { id: { in: ids } } });
    res.status(200).json({ message: "刪除成功" });
    return;
  }

  const id = Number(ids);
  const found = await prisma.contact.findUnique({ where: { id } });
  if (!found) {
    res.status(404).json({ message: `找不到 id: ${ids}` });
    return;
  }

  await prisma.contactList.deleteMany({ where: { cid: id } });
  await prisma.contact.delete({ where: { id } });
  res.status(200).json({ message: "刪除成功" });
}

export async function searchCompany(req: Request, res: Response): Promise<void> {
  const search = typeof req.query.company === "string" ? req.query.company : "";
  const page = parsePage(req.query.page);
  const perPage = 10;

  const where = { company: { contains: search } };
  const [data, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.contact.count({ where }),
  ]);

  res.json(buildPaginatedResponse(data, total, page, perPage, req.originalUrl.split("?")[0]!));
}
