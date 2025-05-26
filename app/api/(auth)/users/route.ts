import { createUser, deleteUser, getAllUsers, updateUser } from "@/services/userService";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        return await getAllUsers();
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        return await createUser(body);
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        return await updateUser(body);
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId") as string;

        return await deleteUser(userId);
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}
