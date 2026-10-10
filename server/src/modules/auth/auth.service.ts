import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/errors";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  const valid =
    user &&
    user.isActive &&
    (await bcrypt.compare(password, user.passwordHash));
  if (!user || !valid)
    throw new AppError(401, "Email atau password salah", "INVALID_CREDENTIALS");

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "8h",
  });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
