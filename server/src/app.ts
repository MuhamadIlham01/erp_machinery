import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { authRoutes } from "./modules/auth/auth.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const api = express.Router();
api.get("/health", (_req, res) =>
  res.json({ success: true, data: { status: "ok" } }),
);
api.use("/auth", authRoutes);
// Fase 2+: customers, suppliers, projects, finance, dashboard, settings

app.use("/api/v1", api);
app.use(notFound);
app.use(errorHandler);
