import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt.js";
import type { Request, Response } from "express";
import { sendMail } from "../notifications/emailService.js";

function generateCode(length = 6): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * 10)];
  return code;
}

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

export const initiateSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.isVerified) return res.status(409).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = existing
      ? await prisma.user.update({ where: { id: existing.id }, data: { name: name ?? existing.name, password: hashed } })
      : await prisma.user.create({ data: { name: name ?? null, email, password: hashed, isVerified: true } });

    const code = generateCode(6);
    const expiresAt = minutesFromNow(15);
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        email,
        code,
        purpose: "SIGNUP",
        expiresAt
      }
    });

    await sendMail(
      email,
      "Verify your Svasthya account",
      `<p>Your verification code is <strong>${code}</strong>. It expires in 15 minutes.</p>`,
      "Account Verification"
    );

    return res.status(200).json({ message: "Verification code sent to email" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifySignup = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body ?? {};
    if (!email || !code) return res.status(400).json({ error: "email and code required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const record = await prisma.verificationCode.findFirst({
      where: { email, purpose: "SIGNUP", usedAt: null },
      orderBy: { createdAt: "desc" }
    });
    if (!record) return res.status(400).json({ error: "No active verification code" });
    if (record.code !== code) return res.status(400).json({ error: "Invalid code" });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: "Code expired" });

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { isVerified: true } }),
      prisma.verificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.profile.create({
        data: {
          userId: user.id,
          displayName: user.name || "User",
          notes: "Welcome to Svasthya! Your health journey starts here."
        }
      })
    ]);

    const token = signJwt({ userId: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });

    const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    return res.status(200).json({ user: safeUser, token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ error: "Account not verified" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({ userId: user.id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    });

    const safeUser = { id: user.id, name: user.name, email: user.email };
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  const u = (req as any).user;
  if (!u) return res.status(401).json({ error: "Unauthorized" });
  const user = await prisma.user.findUnique({
    where: { id: u.id },
    select: { id: true, name: true, email: true, createdAt: true, isVerified: true }
  });
  return res.json({ user });
};

export const initiatePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ message: "If the email exists, a code has been sent" });

    const code = generateCode(6);
    const expiresAt = minutesFromNow(15);
    await prisma.verificationCode.create({
      data: { userId: user.id, email, code, purpose: "RESET_PASSWORD", expiresAt }
    });

    await sendMail(
      email,
      "Reset your Svasthya password",
      `<p>Your password reset code is <strong>${code}</strong>. It expires in 15 minutes.</p>`,
      "Password Reset"
    );

    return res.status(200).json({ message: "If the email exists, a code has been sent" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
export const completePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body ?? {};
    if (!email || !code || !newPassword) return res.status(400).json({ error: "email, code and newPassword required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const record = await prisma.verificationCode.findFirst({
      where: { email, purpose: "RESET_PASSWORD", usedAt: null },
      orderBy: { createdAt: "desc" }
    });
    if (!record) return res.status(400).json({ error: "No active reset code" });
    if (record.code !== code) return res.status(400).json({ error: "Invalid code" });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: "Code expired" });

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
      prisma.verificationCode.update({ where: { id: record.id }, data: { usedAt: new Date() } })
    ]);

    return res.status(200).json({ message: "Password updated" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
