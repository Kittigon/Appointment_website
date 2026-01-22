import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
    try {
        const userId = Number(req.nextUrl.searchParams.get("userId"));

        if (isNaN(userId)) {
            return NextResponse.json(
                { message: "Missing or invalid userId" },
                { status: 400 }
            );
        }

        const reportproblems = await prisma.reportproblems.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: "desc", 
            },
        });

        // ส่ง array กลับเสมอ
        return NextResponse.json(reportproblems, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Get Report Problem Error:", error.message);
        } else {
            console.error("Unknown error:", error);
        }

        return NextResponse.json(
            { message: "Server Get Report Problem Error!" },
            { status: 500 }
        );
    }
}
