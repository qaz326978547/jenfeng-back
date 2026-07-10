import { beforeEach } from "vitest";
import { prisma } from "../src/lib/prisma";
import { redis } from "../src/lib/redis";

// Requires `docker compose -f docker-compose.test.yml up -d` and
// `npx prisma db push` beforehand — see README/testing notes.
beforeEach(async () => {
  await prisma.contactList.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactClass.deleteMany();
  await prisma.contactQuest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.seo.deleteMany();
  await redis.flushdb();
});
