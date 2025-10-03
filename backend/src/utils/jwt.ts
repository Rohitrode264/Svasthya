import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}
