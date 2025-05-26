import { getBlogById, updateBlogById, deleteBlogById } from "@/services/blogService";
import { NextResponse } from "next/server";

interface BlogRouteParams {
    params: { blog: string };
}

export const GET = async (req: Request, { params }: BlogRouteParams) => {
    try {
        const blogId = params.blog;
        return await getBlogById(blogId);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const PATCH = async (req: Request, { params }: BlogRouteParams) => {
    try {
        const blogId = params.blog;
        const { title, description } = await req.json();
        return await updateBlogById(blogId, { title, description });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const DELETE = async (req: Request, { params }: BlogRouteParams) => {
    try {
        const blogId = params.blog;
        return await deleteBlogById(blogId);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}