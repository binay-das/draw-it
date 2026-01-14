import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const SECRET: string = JWT_SECRET;

interface AuthPayload {
    id: string;
}

function isAuthPayload(payload: JwtPayload): payload is AuthPayload {
    return typeof payload.id === "string";
}

function signToken(id: string): string {
    return jwt.sign({
        id
    }, SECRET, {
        expiresIn: "7d"
    })
}

function verifyToken(token: string): AuthPayload {
    const decoded = jwt.verify(token, SECRET);

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

export const auth = {
    signToken,
    verifyToken,
    getUserIdFromToken
}