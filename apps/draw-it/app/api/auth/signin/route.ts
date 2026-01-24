import { NextRequest, NextResponse } from "next/server";
import { SigninSchema, security, auth } from "@repo/common";
import prisma from "@repo/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const parsedData = SigninSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({
                message: "Invalid input",
                errors: parsedData.error
            }, { status: 400 });
        }

        const { email, password } = parsedData.data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const isPasswordCorrect = await security.verifyPassword(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({
                message: "Invalid credentials"
            }, { status: 401 });
        }

        const token = auth.signToken(user.id);

        const response = NextResponse.json({
            message: "Signin successful",
            token
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: "lax",
            path: "/"
        });

        return response;

    } catch (error) {
        console.error("Signin error: ", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
