import { NextRequest, NextResponse } from "next/server";
import type { users } from "@prisma/client";
import prisma from "@/utils/db";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as users;
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: "Email and Password is required!!!" }, { status: 400 })
        }

        //check email user
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return NextResponse.json({ message: "Invalid Credentials!!" })
        }

        //compare password
        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch) {
            return NextResponse.json({ message: "Password is not match" }, { status: 400 })
        }

        //create payload
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }

        //create token
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: "5m"})

        return NextResponse.json({token, user: payload.user}, { status: 200 })


        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Login User Error : ", error.message)
            } else {
                console.error("Unknown error in Login /users : ", error)
            }
            return NextResponse.json({ message: "Sever Login user Error !" }, { status: 400 })
        }
    }