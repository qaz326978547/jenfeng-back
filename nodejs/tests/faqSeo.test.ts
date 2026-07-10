import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./helpers/testApp";
import { prisma } from "../src/lib/prisma";
import { redis } from "../src/lib/redis";

describe("faq (read-only, cached)", () => {
  it("projects only id/name/info/no, ordered by no desc", async () => {
    await prisma.faq.createMany({
      data: [
        { classId: 0, name: "Q1", info: "A1", no: 1 },
        { classId: 0, name: "Q2", info: "A2", no: 5 },
      ],
    });

    const res = await request(app).get("/v2/faq");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: expect.any(Number), name: "Q2", info: "A2", no: 5 },
      { id: expect.any(Number), name: "Q1", info: "A1", no: 1 },
    ]);
  });

  it("caches the result in Redis so subsequent inserts aren't reflected until the cache expires", async () => {
    await request(app).get("/v2/faq"); // primes the cache with an empty result

    await prisma.faq.create({ data: { classId: 0, name: "New", info: "Info", no: 1 } });

    const res = await request(app).get("/v2/faq");
    expect(res.body).toEqual([]);

    await redis.del("faq");
    const fresh = await request(app).get("/v2/faq");
    expect(fresh.body).toHaveLength(1);
  });
});

describe("seo (read-only)", () => {
  it("returns all columns unfiltered", async () => {
    await prisma.seo.create({
      data: {
        relateId: 1,
        tag: "home",
        name: "seo1",
        title: "title1",
        description: "desc1",
        url: "/",
        type: "page",
        keyword: "kw",
        pic: "pic.png",
        picAlt: "alt",
        del: false,
      },
    });

    const res = await request(app).get("/v2/seo");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ tag: "home", title: "title1" });
  });
});
