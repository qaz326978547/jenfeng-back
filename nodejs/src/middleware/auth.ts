import type { NextFunction, Request, RequestHandler, Response } from "express";
import { isTokenRevoked, verifyToken } from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: number; email: string; isAdmin: boolean; jti: string };
    }
  }
}

export const requireAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "未授權" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    if (await isTokenRevoked(payload.jti)) {
      res.status(401).json({ message: "未授權" });
      return;
    }
    req.user = {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
      jti: payload.jti,
    };
    next();
  } catch {
    res.status(401).json({ message: "未授權" });
  }
};

// The original Laravel admin routes were only gated by `auth:api` (i.e. any
// logged-in user), with no is_admin check at all — anyone who registered an
// account could call admin endpoints. This middleware is a deliberate fix,
// not a straight port; see the migration writeup for context.
export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ message: "權限不足" });
    return;
  }
  next();
};
