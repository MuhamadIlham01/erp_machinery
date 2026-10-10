import { Request, Response } from "express";
import { env } from "../../config/env";
import { ok } from "../../lib/response";
import { loginSchema } from "./auth.schema";
import * as service from "./auth.service";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  maxAge: 8 * 60 * 60 * 1000,
};

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const { token, user } = await service.login(email, password);
  res.cookie("token", token, cookieOptions);
  ok(res, user);
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  ok(res, null);
}

export function me(req: Request, res: Response) {
  ok(res, req.user);
}
