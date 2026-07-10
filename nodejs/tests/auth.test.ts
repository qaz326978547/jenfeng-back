import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "./helpers/testApp";

describe("auth", () => {
  it("registers a user and ignores client-supplied is_admin (privilege escalation fix)", async () => {
    const res = await request(app).post("/v2/auth/register").send({
      name: "Test User",
      email: "user@example.com",
      password: "password123",
      password_confirmation: "password123",
      is_admin: true,
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "註冊成功" });

    const login = await request(app)
      .post("/v2/auth/login")
      .send({ email: "user@example.com", password: "password123" });

    const [, payloadB64] = login.body.token.split(".");
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    expect(payload.isAdmin).toBe(false);
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/v2/auth/register").send({
      name: "A",
      email: "dup@example.com",
      password: "password123",
      password_confirmation: "password123",
    });

    const res = await request(app).post("/v2/auth/register").send({
      name: "B",
      email: "dup@example.com",
      password: "password123",
      password_confirmation: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ status: "error", message: "信箱已被註冊" });
  });

  it("rejects mismatched password confirmation", async () => {
    const res = await request(app).post("/v2/auth/register").send({
      name: "A",
      email: "mismatch@example.com",
      password: "password123",
      password_confirmation: "different",
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("rejects wrong credentials with 401", async () => {
    await request(app).post("/v2/auth/register").send({
      name: "A",
      email: "wrongpw@example.com",
      password: "password123",
      password_confirmation: "password123",
    });

    const res = await request(app)
      .post("/v2/auth/login")
      .send({ email: "wrongpw@example.com", password: "nope" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "帳號或密碼錯誤" });
  });

  it("revokes the token on logout so it can no longer authenticate", async () => {
    await request(app).post("/v2/auth/register").send({
      name: "A",
      email: "logout@example.com",
      password: "password123",
      password_confirmation: "password123",
    });
    const login = await request(app)
      .post("/v2/auth/login")
      .send({ email: "logout@example.com", password: "password123" });
    const token = login.body.token as string;

    const logoutRes = await request(app)
      .post("/v2/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);

    const afterLogout = await request(app)
      .get("/v2/admin/contact")
      .set("Authorization", `Bearer ${token}`);
    expect(afterLogout.status).toBe(401);
  });
});
