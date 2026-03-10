import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth } from "@repo/common";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const authResult = auth.verifyTokenSafe(token);
        if (!authResult.valid) return NextResponse.json({ error: authResult.message }, { status: 401 });

        const userId = authResult.id;
        const { slug } = await params;

        const body = await req.json();
        const isShared = Boolean(body.isShared);
        const shapesToSync = body.shapes || [];

        if (typeof body.isShared !== "boolean") {
            return NextResponse.json({ error: "Invalid request body: isShared must be boolean" }, { status: 400 });
        }

        const room = await prisma.room.findUnique({ where: { slug } });
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

        if (room.adminId !== userId) {
            return NextResponse.json({ error: "Only the room admin can toggle sharing" }, { status: 403 });
        }

        await prisma.room.update({
            where: { id: room.id },
            data: { isShared }
        });

        
        if (isShared && shapesToSync.length > 0) {
            await prisma.shape.deleteMany({ where: { roomId: room.id } });

            await prisma.shape.createMany({
                data: shapesToSync.map((shape: any) => ({
                    roomId: room.id,
                    userId: userId,
                    type: shape.type,
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height,
                    text: shape.text ?? null,
                    points: shape.points ? JSON.stringify(shape.points) : null
                }))
            });
        }

        return NextResponse.json({ success: true, isShared }, { status: 200 });

    } catch (error) {
        console.error("Error toggling room sharing:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
