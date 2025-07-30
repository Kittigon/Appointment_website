import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from 'bcrypt'

interface CreateUsetinput {
    email: string;
    password: string;
    name: string;
}


export async function POST(req: NextRequest) {
    const body = await req.json() as CreateUsetinput;
    const { email, password, name } = body;
    try {
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        })

        if (user) {
            return NextResponse.json({ message: "Email already exists" }, { status: 400 })
        }

        //HasH Password 
        const hashPassword = await bcrypt.hash(password, 10)


        await prisma.users.create({
            data: {
                email: email,
                password: hashPassword,
                name: name,
            }
        })

        return NextResponse.json({ message: "Register Success !" }, { status: 201 })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Register User Error : ", error.message)
        } else {
            console.error("Unknown error in Register /users : ", error)
        }
        return NextResponse.json({ message: "Sever Register user Error !" }, { status: 400 })
    }
}