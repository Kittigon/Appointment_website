import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from 'bcrypt'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        const showuser = await prisma.users.findUnique({
            where: {
                id: id
            },
            select: {
                email: true,
                name: true,
                gender: true,
                age: true
            }
        })

        return NextResponse.json({ showuser }, { status: 200 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("GET ID User Error : ", error.message)
        } else {
            console.error("Unknow error in GET ID User : ", error)
        }
        return NextResponse.json({ message: "Sever GET ID User Error !" }, { status: 400 })
    }
}

interface editUser {
    email: string;
    name: string;
    gender: string;
    age: number
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)
        const body = await req.json() as editUser
        const { email, name, gender, age } = body;
        await prisma.users.update({
            where: {
                id: id
            },
            data: {
                email,
                name,
                gender,
                age
            }
        })

        return NextResponse.json({ message: "Update User Success !" }, { status: 200 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("PUT ID User Error : ", error.message)
        } else {
            console.error("Unknow error in PUT ID User Error !", error)
        }
        return NextResponse.json({ message: "Sever PUT ID User Error !" }, { status: 400 })
    }
}

interface chagepassword {
    password: string;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)
        const body = await req.json() as chagepassword;
        const { password } = body;

        //hashPassword
        const hashPassword = await bcrypt.hash(password, 10)

        await prisma.users.update({
            where: {
                id: id
            },
            data: {
                password: hashPassword
            }
        })

        return NextResponse.json({ message: "Update Password Success !" }, { status: 200 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("PATCH ID User Error : ", error.message)
        } else {
            console.error("Unknow error in PATCH ID User ! ", error)
        }
        return NextResponse.json({ message: "Sever PATCH ID User Error !" }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id)
        await prisma.users.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({ message: "Delete User Success !" }, { status: 200 })
    } catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            console.error("DELETE ID User Error : ", error.message)
        } else {
            console.error("Unknow error in DELETE ID User ! ", error)
        }
        return NextResponse.json({ message: "Sever DELETE ID User !" }, { status: 400 })
    }
}
