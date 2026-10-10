import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: Role };
    }
  }
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.token;
    if (!token)
      throw new AppError(
        401,
        "Silakan login terlebih dahulu",
        "UNAUTHENTICATED",
      );
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive)
      throw new AppError(401, "Sesi tidak valid", "UNAUTHENTICATED");
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (e) {
    next(
      e instanceof AppError
        ? e
        : new AppError(401, "Sesi tidak valid", "UNAUTHENTICATED"),
    );
  }
}

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(new AppError(403, "Anda tidak memiliki akses", "FORBIDDEN"));
    next();
  };
