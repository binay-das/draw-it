import { NextRequest, NextResponse } from "next/server";
import { auth } from "@repo/common";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            );
        }

        const newToken = auth.refreshToken(token);
        if (!newToken) {
            return NextResponse.json(
                { message: "Invalid token for refresh" },
                { status: 401 }
            );
        }

        const response = NextResponse.json({
            message: "Token refreshed successfully",
            token: newToken
        }, { status: 200 });

        response.cookies.set("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "lax",
            path: "/"
        });

        return response;
    } catch (error) {
        console.error("Refresh error:", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
