import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth, ShapeSchema } from "@repo/common";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
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

        const { roomId } = await params;

        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        const rawShapes = await prisma.shape.findMany({
            where: { roomId: room.id },
            orderBy: { createdAt: "asc" },
            select: {
                type: true,
                x: true,
                y: true,
                width: true,
                height: true,
                text: true,
                points: true
            }
        });

        const shapes = rawShapes.map((s) => {
            let parsedPoints;
            try {
                parsedPoints = s.points ? JSON.parse(s.points) : undefined;
            } catch (e) {
                console.error("Failed to parse points JSON:", s.points);
            }

            const result = ShapeSchema.safeParse({ ...s, text: s.text ?? undefined, points: parsedPoints });

            if (result.success) return result.data;

            console.error("Shape schema validation failed:", result.error.message);
            return null;
        }).filter((s) => s !== null);

        return NextResponse.json({ shapes, isShared: room.isShared }, { status: 200 });
    } catch (error) {
        console.error("Error fetching shapes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const authResult = auth.verifyTokenSafe(token);
        if (!authResult.valid) return NextResponse.json({ error: authResult.message }, { status: 401 });

        const userId = authResult.id;
        const { roomId } = await params;

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

        const body = await req.json();
        const { action, shape } = body;

        if (!action || !shape) {
            return NextResponse.json({ error: "Missing action or shape data" }, { status: 400 });
        }

        if (action === "add") {
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
                    room: { connect: { id: room.id } }
                }
            });
        } else if (action === "delete") {
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
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Error syncing shape:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
