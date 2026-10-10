import { Response } from "express";

export const ok = <T>(
  res: Response,
  data: T,
  meta?: Record<string, unknown>,
  status = 200,
) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
