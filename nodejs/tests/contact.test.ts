import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./helpers/testApp";
import { createAdminAndToken } from "./helpers/adminAuth";

const validPayload = {
  class: "測試課程",
  quest: "想了解課程內容",
  company: "測試公司",
  tel: "0912345678",
  num: "2",
  contactList: [
    { name: "王小明", email: "wang@example.com", job: "工程師", cel: "0987654321" },
    { name: "李小華", email: "li@example.com", cel: "0911222333" },
  ],
};

describe("contact (public)", () => {
  it("creates a contact with nested contactList rows", async () => {
    const res = await request(app).post("/v2/contact").send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("新增成功");
    expect(res.body.data.contactList).toHaveLength(2);
    expect(res.body.data.contactList[0].cid).toBe(res.body.data.id);
  });

  it("returns a 400 with the first validation message on missing fields", async () => {
    const res = await request(app).post("/v2/contact").send({ class: "測試課程" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(typeof res.body.message).toBe("string");
  });

  it("rejects an empty contactList", async () => {
    const res = await request(app)
      .post("/v2/contact")
      .send({ ...validPayload, contactList: [] });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("請提供聯絡人列表");
  });
});

describe("contact (admin)", () => {
  it("requires authentication", async () => {
    const res = await request(app).get("/v2/admin/contact");
    expect(res.status).toBe(401);
  });

  it("requires admin privileges, not just login", async () => {
    // A plain registered user (isAdmin=false) must be forbidden — this is
    // the authorization fix relative to the original Laravel routes.
    await request(app).post("/v2/auth/register").send({
      name: "Plain",
      email: "plain@example.com",
      password: "password123",
      password_confirmation: "password123",
    });
    const login = await request(app)
      .post("/v2/auth/login")
      .send({ email: "plain@example.com", password: "password123" });

    const res = await request(app)
      .get("/v2/admin/contact")
      .set("Authorization", `Bearer ${login.body.token}`);
    expect(res.status).toBe(403);
  });

  it("lists contacts with Laravel-style pagination fields", async () => {
    const token = await createAdminAndToken();
    await request(app).post("/v2/contact").send(validPayload);

    const res = await request(app)
      .get("/v2/admin/contact")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ current_page: 1, per_page: 10, total: 1 });
    expect(res.body.data).toHaveLength(1);
  });

  it("updates a contact's real fields (fixes the original update() bug)", async () => {
    const token = await createAdminAndToken();
    const created = await request(app).post("/v2/contact").send(validPayload);

    const res = await request(app)
      .put(`/v2/admin/contact/${created.body.data.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validPayload, company: "更新後公司" });

    expect(res.status).toBe(200);
    expect(res.body.data.company).toBe("更新後公司");
  });

  it("bulk deletes by ids and reports missing ids with 404", async () => {
    const token = await createAdminAndToken();
    const created = await request(app).post("/v2/contact").send(validPayload);
    const id = created.body.data.id as number;

    const missing = await request(app)
      .delete("/v2/admin/contact")
      .set("Authorization", `Bearer ${token}`)
      .send({ ids: [id, 999999] });
    expect(missing.status).toBe(404);

    const ok = await request(app)
      .delete("/v2/admin/contact")
      .set("Authorization", `Bearer ${token}`)
      .send({ ids: [id] });
    expect(ok.status).toBe(200);

    const show = await request(app)
      .get(`/v2/admin/contact/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(show.status).toBe(404);
  });

  it("searches contacts by company name", async () => {
    const token = await createAdminAndToken();
    await request(app)
      .post("/v2/contact")
      .send({ ...validPayload, company: "力群人力資源" });
    await request(app)
      .post("/v2/contact")
      .send({ ...validPayload, company: "其他公司" });

    const res = await request(app)
      .get("/v2/admin/contact/search/search-company")
      .query({ company: "力群" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].company).toBe("力群人力資源");
  });
});
