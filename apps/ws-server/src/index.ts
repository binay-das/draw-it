import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), "../../.env") });

import { WebSocketServer, WebSocket } from "ws";
import { auth, WsMessageSchema } from "@repo/common";
import prisma from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string;
    roomSlugs: string[];
    ws: WebSocket;
}

const users: User[] = [];

function getTokenFromCookie(cookieHeader?: string) {
    if (!cookieHeader) return null;

    const cookies: Record<string, string> = {};

    cookieHeader.split(";").forEach(cookie => {
        const [name, ...rest] = cookie.trim().split("=");

        if (!name) return;
        cookies[name] = rest.join("=");
    });

    return cookies.token ?? null;
}

function isAllowedOrigin(origin?: string): boolean {
    if (!origin) return false;

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
    if (!allowedOrigins) return false;

    return allowedOrigins.includes(origin);
}


wss.on("connection", (ws, req) => {

    const origin = req.headers.origin;
    if (!isAllowedOrigin(origin)) {
        console.log("Unauthorized origin:", origin);
        ws.close(1008, "Unauthorized origin");
        return;
    }

    const token = getTokenFromCookie(req.headers.cookie);
    if (!token) {
        console.log("no token");
        ws.close();
        return;
    }
    console.log(token);
    const authResult = auth.verifyTokenSafe(token);

    if (!authResult.valid) {
        console.log("Token validation failed:", authResult.message);
        ws.close(1008, authResult.message);
        return;
    }

    const userId = authResult.id;

    users.push({
        userId,
        roomSlugs: [],
        ws
    });

    console.log("Client connected, id: ", userId);

    ws.on("message", async (data) => {
        console.log("Raw Message received: ", data);

        let parsedData;

        try {
            const jsonObject = JSON.parse(data.toString());
            const validationResult = WsMessageSchema.safeParse(jsonObject);

            if (!validationResult.success) {
                console.error("Validation failed for incoming message:", validationResult.error.message);
                return;
            }
            parsedData = validationResult.data;
        } catch (err) {
            console.error("Invalid JSON received (length): ", data.toString().length);
            return;
        }

        console.log("Parsed Data: ", parsedData);

        if (parsedData.type === "join") {
            const user = users.find((user) => user.userId === userId);
            if (!user) {
                return;
            }

            const roomSlug = parsedData.roomSlug;
            if (user.roomSlugs.includes(roomSlug)) {
                console.log(`User ${userId} already in room ${roomSlug}`);
                return;
            }
            user.roomSlugs.push(roomSlug);
            console.log(`User ${userId} joined room ${roomSlug}`);


            await prisma.room.upsert({
                where: { slug: roomSlug },
                update: {},
                create: {
                    slug: roomSlug,
                    adminId: userId
                }
            });

            console.log("room pushed to db")

            console.log("total no of connected users: ", users.length);
        }

        if (parsedData.type === "leave") {
            const user = users.find((user) => user.userId === userId);
            if (!user) {
                return;
            }
            const roomSlug = parsedData.roomSlug;
            if (!user.roomSlugs.includes(roomSlug)) {
                console.log(`User ${userId} not in room ${roomSlug}`);
                return;
            }
            user.roomSlugs = user.roomSlugs.filter((slug) => slug !== roomSlug);
            console.log(`User ${userId} left room ${roomSlug}`);
        }

        if (parsedData.type === "chat") {
            const user = users.find((u) => u.userId === userId);
            if (!user) return;

            const roomSlug = parsedData.roomSlug;
            if (!user.roomSlugs.includes(roomSlug)) return;

            const message = JSON.stringify(parsedData.message);

            users.forEach((u) => {
                if (u.roomSlugs.includes(roomSlug)) {
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        roomSlug,
                        message: JSON.parse(message)
                    }));
                }
            });

            await prisma.chat.create({
                data: {
                    message,
                    user: {
                        connect: { id: userId }
                    },
                    room: {
                        connect: { slug: roomSlug }
                    }
                }
            });
        }

    })

    ws.on("close", () => {
        const userIndex = users.findIndex((user) => user.userId === userId);
        if (userIndex === -1) {
            return;
        }
        users.splice(userIndex, 1);
        console.log("Client disconnected, id: ", userId);
    })

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    })
});

console.log("WebSocket server is running on ws://localhost:8080");
