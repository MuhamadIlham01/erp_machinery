import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../lib/errors";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Endpoint tidak ditemukan", "NOT_FOUND"));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const fail = (
    status: number,
    message: string,
    code: string,
    details?: unknown,
  ) =>
    res
      .status(status)
      .json({ success: false, error: { code, message, details } });

  if (err instanceof ZodError) {
    return fail(
      400,
      "Data tidak valid",
      "VALIDATION_ERROR",
      err.flatten().fieldErrors,
    );
  }
  if (err instanceof AppError) return fail(err.status, err.message, err.code);
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return fail(409, "Data duplikat", "DUPLICATE");
    if (err.code === "P2003")
      return fail(
        409,
        "Data tidak bisa dihapus karena masih dipakai data lain",
        "IN_USE",
      );
    if (err.code === "P2025")
      return fail(404, "Data tidak ditemukan", "NOT_FOUND");
  }
  console.error(err);
  return fail(500, "Terjadi kesalahan pada server", "INTERNAL_ERROR");
}
