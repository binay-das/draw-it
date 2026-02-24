import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return secret;
}

export const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const RoomSchema = z.object({
    slug: z.string().min(3).max(10),
});

interface AuthPayload {
    id: string;
}

function isAuthPayload(payload: JwtPayload): payload is AuthPayload {
    return typeof payload.id === "string";
}

function signToken(id: string): string {
    return jwt.sign({
        id
    }, getJwtSecret(), {
        expiresIn: "7d"
    })
}

function verifyToken(token: string): AuthPayload {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded === "string" || !isAuthPayload(decoded)) {
        throw new Error("Invalid JWT payload");
    }

    return decoded;
}

export type TokenValidationResult =
    | { valid: true; id: string }
    | { valid: false; error: "EXPIRED" | "INVALID"; message: string };

function verifyTokenSafe(token: string): TokenValidationResult {
    try {
        const decoded = jwt.verify(token, getJwtSecret());
        if (typeof decoded === "string" || !isAuthPayload(decoded)) {
            return { valid: false, error: "INVALID", message: "Invalid JWT payload" };
        }
        return { valid: true, id: decoded.id };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { valid: false, error: "EXPIRED", message: "Token expired" };
        }
        return { valid: false, error: "INVALID", message: "Invalid token structure or signature" };
    }
}

function refreshToken(expiredToken: string): string | null {
    try {
        const decoded = jwt.verify(expiredToken, getJwtSecret(), { ignoreExpiration: true });
        if (typeof decoded === "string" || !isAuthPayload(decoded)) {
            return null;
        }
        // Issue new token
        return signToken(decoded.id);
    } catch (error) {
        return null; 
    }
}

function getUserIdFromToken(token?: string): string | null {
    if (!token) {
        return null;
    }

    const result = verifyTokenSafe(token);
    if (!result.valid) {
        // Silent error return to prevent console log spam
        return null;
    }
    return result.id;
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export const auth = {
    signToken,
    verifyToken,
    verifyTokenSafe,
    refreshToken,
    getUserIdFromToken
};

export const security = {
    hashPassword,
    verifyPassword
};