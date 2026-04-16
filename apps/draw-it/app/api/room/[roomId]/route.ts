import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth } from "@repo/common";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ 
            error: "Unauthorized" 
        }, { 
            status: 401 
        });

        const authResult = auth.verifyTokenSafe(token);
        if (!authResult.valid) return NextResponse.json({ 
            error: authResult.message 
        }, { 
            status: 401 
        });

        const userId = authResult.id;
        const { roomId } = await params;

        const room = await prisma.room.findUnique({ 
            where: { 
                id: roomId 
            } 
        });

        if (!room) return NextResponse.json({ 
            error: "Room not found" 
        }, { 
            status: 404 
        });


        if (room.adminId !== userId) {
            return NextResponse.json({ 
                error: "Unauthorized: Only the admin can delete the room" 
            }, { 
                status: 403 
            });
        }

        await prisma.room.delete({ 
            where: { 
                id: roomId 
            } 
        });

        return NextResponse.json({ 
            success: true, 
            message: "Room deleted successfully" 
        }, { 
            status: 200 
        });

    } catch (error) {
        console.error("Error deleting room:", error);
        return NextResponse.json({ 
            error: "Internal server error" 
        }, { 
            status: 500 
        });
    }
}
