import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";


// mentalhealth | admin แก้ไขการนัดหมาย
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        const body = await req.json()
        const { date, time, description } = body;

        await prisma.appointments.update({
            where: {
                id: id
            },
            data: {
                date,
                time,
                description
            }
        })

        return NextResponse.json({ message: "Update Appoinment Success !" }, { status: 200 })


    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("PUT ID Appoinment Error : ", error.message)
        } else {
            console.error("Unknow error in PUT ID Appoinment ! ", error)
        }
        return NextResponse.json({ message: "Sever PUT ID Appoinment !" }, { status: 400 })
    }
}

// mentalhealth | admin ลบข้อมูลการนัดหมาย
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        await prisma.appointments.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ message: "DELETE Appoinment Success !" })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("DELETE ID User Error : ", error.message)
        } else {
            console.error("Unknow error in DELETE ID User !", error)
        }
        return NextResponse.json({ message: "Sever DELETE ID Appoinment Error !" }, { status: 400 })
    }
}