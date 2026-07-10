import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./helpers/testApp";
import { createAdminAndToken } from "./helpers/adminAuth";

describe("contact-class", () => {
  it("public index only returns rows where del=false, ordered by no desc", async () => {
    const token = await createAdminAndToken();
    await request(app)
      .post("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "A", no: 1 });
    await request(app)
      .post("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "B", no: 2 });

    const res = await request(app).get("/v2/contact-class");
    expect(res.status).toBe(200);
    expect(res.body.map((r: { name: string }) => r.name)).toEqual(["B", "A"]);
  });

  it("supports bulk delete via ids and single delete via a scalar id", async () => {
    const token = await createAdminAndToken();
    const a = await request(app)
      .post("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "A", no: 1 });
    const b = await request(app)
      .post("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "B", no: 2 });

    const bulk = await request(app)
      .delete("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ ids: [a.body.data.id] });
    expect(bulk.status).toBe(200);

    const single = await request(app)
      .delete("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ ids: b.body.data.id });
    expect(single.status).toBe(200);

    const remaining = await request(app).get("/v2/contact-class");
    expect(remaining.body).toHaveLength(0);
  });

  it("validates required fields with the original Chinese error messages", async () => {
    const token = await createAdminAndToken();
    const res = await request(app)
      .post("/v2/admin/contact-class")
      .set("Authorization", `Bearer ${token}`)
      .send({ no: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("請輸入name");
  });
});
