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

        const appointments = await prisma.appointments.findMany({
            where: {
                userId: userId,
            },
            orderBy: [
                { date: "desc" },
                { time: "desc" },
            ],
        });

        const now = new Date();


        const needComplete = appointments.filter((item) => {
            if (item.status !== "CONFIRMED") return false;

            // รวม date + time เป็น Date เดียว
            // item.date = yyyy-mm-dd
            // item.time = HH:mm
            const appointmentDateTime = new Date(
                `${item.date}T${item.time}:00`
            );

            return appointmentDateTime < now;
        });

        if (needComplete.length > 0) {
            await prisma.appointments.updateMany({
                where: {
                    id: { in: needComplete.map((i) => i.id) },
                },
                data: {
                    status: "COMPLETED",
                },
            });
        }

        const showAppoinment = await prisma.appointments.findMany({
            where: {
                userId: userId,
            },
            orderBy: [
                { date: "desc" },
                { time: "desc" },
            ],
        });

        return NextResponse.json({ showAppoinment });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("GET Appointment History Error:", error.message);
        } else {
            console.error("Unknown Error:", error);
        }

        return NextResponse.json(
            { message: "Server error while fetching appointment history" },
            { status: 500 }
        );
    }
}
