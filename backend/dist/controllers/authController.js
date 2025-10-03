import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt.js";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "email and password required" });
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({ error: "Email already in use" });
        const hashed = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await prisma.user.create({
            data: { name: name ?? null, email, password: hashed }
        });
        const token = signJwt({ userId: user.id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24
        });
        const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
        return res.status(201).json({ user: safeUser, token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "email and password required" });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = signJwt({ userId: user.id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24
        });
        const safeUser = { id: user.id, name: user.name, email: user.email };
        return res.json({ user: safeUser, token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};
export const me = async (req, res) => {
    const u = req.user;
    if (!u)
        return res.status(401).json({ error: "Unauthorized" });
    const user = await prisma.user.findUnique({
        where: { id: u.id },
        select: { id: true, name: true, email: true, createdAt: true }
    });
    return res.json({ user });
};
//# sourceMappingURL=authController.js.map