import { verifyJwt } from "../utils/jwt.js";
import prisma from "../prisma/client.js";
import type { Request, Response, NextFunction } from "express";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;
  let token: string | undefined;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (typeof cookieToken === "string") {
    token = cookieToken;
  }

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const payload = verifyJwt<{ userId: string }>(token);
  if (!payload?.userId) return res.status(401).json({ error: "Invalid token" });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return res.status(401).json({ error: "User not found" });

  (req as any).user = { id: user.id, email: user.email };
  next();
}
