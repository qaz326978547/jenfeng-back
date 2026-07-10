import bcrypt from "bcrypt";
import { prisma } from "../../src/lib/prisma";
import { signToken } from "../../src/utils/jwt";

// The API can no longer create admins (that self-service escalation path
// was removed — see validators/auth.validators.ts), so tests that need an
// admin go straight to Prisma, exactly like an operator would in production.
export async function createAdminAndToken(email = "admin@example.com"): Promise<string> {
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: await bcrypt.hash("password123", 10),
      isAdmin: true,
    },
  });
  return signToken({ id: user.id, email: user.email, isAdmin: true });
}
