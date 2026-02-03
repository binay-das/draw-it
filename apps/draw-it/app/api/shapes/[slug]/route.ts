import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth } from "@repo/common";

type ShapeType = "rectangle" | "square" | "circle" | "line" | "arrow";

interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = auth.getUserIdFromToken(token);
        if (!userId) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        const { slug } = await params;

        const room = await prisma.room.findUnique({
            where: {
                slug
            }
        });

        if (!room) {
            return NextResponse.json(
                { error: "Room not found" },
                { status: 404 }
            );
        }

        const chats = await prisma.chat.findMany({
            where: {
                roomId: room.id
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        const shapes: Shape[] = chats.map((chat) => {
            try {
                const parsed = JSON.parse(chat.message);
                return {
                    type: parsed.type || "rectangle",
                    x: parsed.x,
                    y: parsed.y,
                    width: parsed.width,
                    height: parsed.height
                } as Shape;
            } catch (error) {
                console.error("Error parsing shape:", error);
                return null;
            }
        }).filter((shape): shape is Shape => shape !== null);

        return NextResponse.json({ shapes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
