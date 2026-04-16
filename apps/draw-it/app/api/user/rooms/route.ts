import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db";
import { auth } from "@repo/common";

export async function GET(req: NextRequest) {
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


        const rooms = await prisma.room.findMany({
            where: {
                adminId: userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            select: {
                id: true,
                slug: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({ rooms }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user rooms:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const authResult = auth.verifyTokenSafe(token);
        if (!authResult.valid) {
            return NextResponse.json({ error: authResult.message }, { status: 401 });
        }

        const userId = authResult.id;
        const body = await req.json();
        const { slug } = body;

        if (!slug || typeof slug !== "string") {
            return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
        }

        // Upsert room: unique for this user+slug
        const room = await prisma.room.upsert({
            where: {
                adminId_slug: {
                    adminId: userId,
                    slug: slug.trim()
                }
            },
            update: {},
            create: {
                slug: slug.trim(),
                adminId: userId
            }
        });

        return NextResponse.json({ room }, { status: 200 });
    } catch (error) {
        console.error("Error creating/finding room:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
