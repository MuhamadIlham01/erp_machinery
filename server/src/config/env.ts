import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z
    .string()
    .min(32, "ganti-dengan-string-acak-minimal-32-karakter"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
});

export const env = schema.parse(process.env);
