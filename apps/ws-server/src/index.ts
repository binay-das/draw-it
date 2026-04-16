import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), "../../.env") });

import { WebSocketServer, WebSocket } from "ws";
import { auth, WsMessageSchema } from "@repo/common";
import prisma from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string;
    roomIds: string[];
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
        roomIds: [],
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
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Invalid message format: " + validationResult.error.issues.map(i => i.message).join(", ")
                }));
                return;
            }
            parsedData = validationResult.data;
        } catch (err) {
            console.error("Invalid JSON received (length): ", data.toString().length);
            return;
        }

        console.log("Parsed Data: ", parsedData);

        if (parsedData.type === "join") {
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }

            const roomId = parsedData.roomId;
            if (user.roomIds.includes(roomId)) {
                console.log(`User ${userId} already in room ${roomId}`);
                return;
            }

            // Verify room exists
            const room = await prisma.room.findUnique({ where: { id: roomId } });
            if (!room) {
                ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
                return;
            }

            user.roomIds.push(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
            console.log("total no of connected users: ", users.length);
        }

        if (parsedData.type === "leave") {
            const user = users.find((user) => user.ws === ws);
            if (!user) {
                return;
            }
            const roomId = parsedData.roomId;
            if (!user.roomIds.includes(roomId)) {
                console.log(`User ${userId} not in room ${roomId}`);
                return;
            }
            user.roomIds = user.roomIds.filter((id) => id !== roomId);
            console.log(`User ${userId} left room ${roomId}`);
        }

        if (parsedData.type === "chat") {
            const user = users.find((u) => u.ws === ws);
            if (!user) return;

            const roomId = parsedData.roomId;
            if (!user.roomIds.includes(roomId)) {
                return;
            }


            const shape = parsedData.message;

            users.forEach((u) => {
                if (u.ws !== ws && u.roomIds.includes(roomId)) {
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message: shape
                    }));
                }
            });

            await prisma.shape.create({
                data: {
                    type: shape.type,
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height,
                    text: shape.text ?? null,
                    points: shape.points ? JSON.stringify(shape.points) : null,
                    user: { connect: { id: userId } },
                    room: { connect: { id: roomId } }
                }
            });
        }

        if (parsedData.type === "delete") {
            const user = users.find((u) => u.ws === ws);
            if (!user) return;

            const roomId = parsedData.roomId;
            if (!user.roomIds.includes(roomId)) return;

            const shape = parsedData.message;

            users.forEach((u) => {
                if (u.ws !== ws && u.roomIds.includes(roomId)) {
                    u.ws.send(JSON.stringify({
                        type: "delete",
                        roomId,
                        message: shape
                    }));
                }
            });

            const room = await prisma.room.findUnique({ where: { id: roomId } });
            if (room) {
                await prisma.shape.deleteMany({
                    where: {
                        roomId: room.id,
                        type: shape.type,
                        x: shape.x,
                        y: shape.y,
                        width: shape.width,
                        height: shape.height,
                        ...(shape.text !== undefined ? { text: shape.text } : {}),
                        ...(shape.points !== undefined ? { points: JSON.stringify(shape.points) } : {})
                    }
                });
            }
        }

        if (parsedData.type === "draw-stream") {
            const user = users.find((u) => u.ws === ws);
            if (!user) return;

            const roomId = parsedData.roomId;
            if (!user.roomIds.includes(roomId)) return;

            // Broadcast active drawing shape to everyone else in the room
            // Do NOT persist to database — it's transient until mouseup
            users.forEach((u) => {
                if (u.ws !== ws && u.roomIds.includes(roomId)) {
                    u.ws.send(JSON.stringify({
                        type: "draw-stream",
                        roomId,
                        message: parsedData.message
                    }));
                }
            });
        }

    })

    ws.on("close", () => {
        const userIndex = users.findIndex((user) => user.ws === ws);
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
