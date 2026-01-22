import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { Status } from "@prisma/client";

export async function GET() {
    try {
        const appointments = await prisma.appointments.findMany({
            where: {
                status: {
                    in: [Status.COMPLETED, Status.CANCELLED],
                },
            },
            orderBy: [
                { date: "desc" },
                { time: "desc" },
            ],
        });

        return NextResponse.json(appointments);
    } catch (error) {
        console.error("GET AppointmentHistory Error:", error);
        return NextResponse.json(
            { message: "Server Error" },
            { status: 500 }
        );
    }
}
