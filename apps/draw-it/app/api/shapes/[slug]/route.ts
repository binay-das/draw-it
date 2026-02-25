import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth, ShapeSchema } from "@repo/common";

// Shape types are now managed by @repo/common

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

        const authResult = auth.verifyTokenSafe(token);
        if (!authResult.valid) {
            return NextResponse.json(
                { error: authResult.message },
                { status: 401 }
            );
        }

        const userId = authResult.id;

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

        const shapes = chats.map((chat) => {
            try {
                const parsed = JSON.parse(chat.message);
                const result = ShapeSchema.safeParse(parsed);
                if (result.success) {
                    return result.data;
                }
                console.error("Shape schema validation failed:", result.error.message);
                return null;
            } catch (error) {
                console.error("Error parsing shape JSON:", error);
                return null;
            }
        }).filter((shape) => shape !== null);

        return NextResponse.json({ shapes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
