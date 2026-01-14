import { WebSocketServer, WebSocket } from "ws";
import { auth } from "@repo/common";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string;
    roomSlugs: string[];
    ws: WebSocket;
}

const users: User[] = [];

wss.on("connection", (ws, req) => {
    const url = req.url;
    if (!url) {
        return;
    }

    const queryparams = new URLSearchParams(url);
    const token = queryparams.get("token");
    if (!token) {
        ws.close();
        return;
    }
    const userId = auth.getUserIdFromToken(token);

    if (!userId) {
        ws.close();
        return;
    }

    users.push({
        userId,
        roomSlugs: [],
        ws
    });

    console.log("Client connected, id: ", userId);

    ws.on("message", (data) => {
        console.log("Raw Message received: ", data);

        const parsedData = JSON.parse(data.toString());
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
            const user = users.find((user) => user.userId === userId);
            if (!user) {
                return;
            }
            const roomSlug = parsedData.roomSlug;

            if (!user.roomSlugs.includes(roomSlug)) {
                console.log(`User ${userId} not in room ${roomSlug}`);
                return;
            }
            const message = parsedData.message;
            users.forEach((user) => {
                if (user.roomSlugs.includes(roomSlug)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomSlug,
                        message
                    }));
                }
            })

            console.log(`User ${userId} sent message ${message} to room ${roomSlug}`);

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

