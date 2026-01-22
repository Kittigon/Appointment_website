import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = Number(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        await prisma.notifications.updateMany({
            where: {
                isRead: false,
                OR: [
                    { type: "DASS21" },
                    { type: "APPOINTMENT" },
                ],
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error fetching unread notifications count:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}