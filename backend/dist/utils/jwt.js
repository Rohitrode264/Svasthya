import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment");
}
export function signJwt(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function verifyJwt(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
}
//# sourceMappingURL=jwt.js.map