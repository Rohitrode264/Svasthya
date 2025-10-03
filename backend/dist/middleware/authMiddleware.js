import { verifyJwt } from "../utils/jwt.js";
import prisma from "../prisma/client.js";
export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else if (typeof cookieToken === "string") {
        token = cookieToken;
    }
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyJwt(token);
    if (!payload?.userId)
        return res.status(401).json({ error: "Invalid token" });
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user)
        return res.status(401).json({ error: "User not found" });
    req.user = { id: user.id, email: user.email };
    next();
}
//# sourceMappingURL=authMiddleware.js.map