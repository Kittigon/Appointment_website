import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// Add `request: Request` as the first argument
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);
        await prisma.dass_21_result.delete({
            where: {
                id: id
            }
        });

        return NextResponse.json({ message: "Delete User Success !" }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("DELETE ID DASS21 Error : ", error.message);
        } else {
            console.error("Unknow error in DELETE ID DASS21 ! ", error);
        }
        return NextResponse.json({ message: "Server DELETE ID DASS21 Error!" }, { status: 500 }); // Use 500 for server errors
    }
}