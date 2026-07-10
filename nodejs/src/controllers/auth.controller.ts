import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { revokeToken, signToken, verifyToken } from "../utils/jwt";

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    res.status(400).json({ status: "error", message: "信箱已被註冊" });
    return;
  }

  const hashed = await bcrypt.hash(data.password, 10);
  // isAdmin is always false on self-registration — see validators/auth.validators.ts.
  await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, isAdmin: false },
  });

  res.status(201).json({ message: "註冊成功" });
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const passwordMatches = user ? await bcrypt.compare(data.password, user.password) : false;

  if (!user || !passwordMatches) {
    res.status(401).json({ message: "帳號或密碼錯誤" });
    return;
  }

  const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
  res.status(200).json({ token });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (token) {
    const payload = verifyToken(token);
    await revokeToken(payload.jti, payload.exp);
  }

  res.status(200).json({ message: "登出成功" });
}
