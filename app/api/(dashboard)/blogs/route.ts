import { createBlog, getAllBlogs } from "@/services/blogService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');
        const searchKeywords = searchParams.get('keywords') as string;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Ensure userId and categoryId are not null before passing
        return await getAllBlogs(userId!, categoryId!, searchKeywords, startDate, endDate, page, limit);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const categoryId = searchParams.get('categoryId');
        const { title, description } = await req.json();

        // Ensure userId and categoryId are not null before passing
        return await createBlog(userId!, categoryId!, title, description);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}