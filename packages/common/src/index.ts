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

function getUserIdFromToken(token?: string): string | null {
    if (!token) {
        return null;
    }

    try {
        const decoded = verifyToken(token);
        return decoded.id;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
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
    getUserIdFromToken
};

export const security = {
    hashPassword,
    verifyPassword
};