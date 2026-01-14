import { NextRequest, NextResponse } from "next/server";
import { CreateUserSchema, security } from "@repo/common";
import prisma from "@repo/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const parsedData = CreateUserSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({
                message: "Invalid input",
                errors: parsedData.error
            }, { status: 400 });
        }

        const { name, email, password } = parsedData.data;

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({
                message: "User already exists"
            }, { status: 409 });
        }

        const hashedPassword = await security.hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        return NextResponse.json({
            message: "User created successfully",
            userId: user.id
        }, { status: 201 });

    } catch (error) {
        console.error("Signup error: ", error);
        return NextResponse.json({
            message: "Internal server error"
        }, { status: 500 });
    }
}
