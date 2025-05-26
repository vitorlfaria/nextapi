import { createCategory, getCategoriesByUserId } from "@/services/categoryService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        return await getCategoriesByUserId(userId);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const { title } = await req.json();
        return await createCategory(userId, title);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}