import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), "../../.env") });

import { WebSocketServer, WebSocket } from "ws";
import { auth } from "@repo/common";
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


wss.on("connection", (ws, req) => {
  //   const url = req.url;
  //   if (!url) {
  //       return;
  //   }
  // console.log(url);

  // const queryparams = url.split("?")[1];
  //   const token = new URLSearchParams(queryparams).get("token");
  //
  
  const token = getTokenFromCookie(req.headers.cookie); 
  if (!token) {
    console.log("no token");
        ws.close();
        return;
  }
  console.log(token);
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

    ws.on("message", async (data) => {
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

            const room = await prisma.room.findUnique({
                where: {
                    slug: roomSlug
                }
            })
            if (room) {
                console.log("room already in db")
            }
            if (!room) {
                await prisma.room.create({
                    data: {
                        slug: roomSlug,
                        adminId: userId
                    }
                });
                console.log("room pushed to db")
            }
            

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

            const room = await prisma.room.findUnique({
                where: {
                    slug: roomSlug
                }
            });
            if (!room) {
                console.log("room not found");
                return;
            }

            const newMsg = await prisma.chat.create({
                data: {
                    roomId: room.id,
                    message,
                    userId
                }
            });
            if (newMsg) {
                console.log("msg saved in db");
            }


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
