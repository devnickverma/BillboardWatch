import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  (app as any)(req, res);
}
