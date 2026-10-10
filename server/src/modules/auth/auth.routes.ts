import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as c from "./auth.controller";

export const authRoutes = Router();
authRoutes.post("/login", c.login);
authRoutes.post("/logout", c.logout);
authRoutes.get("/me", requireAuth, c.me);
