import connect from "@/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/blog";

export const GET = async (req: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const blogId = (await params).blog;

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
        }

        await connect();

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const PATCH = async (req: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const blogId = (await params).blog;
        const { title, description } = await req.json();

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
        }

        await connect();

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        );

        return NextResponse.json(
            { message: 'Blog updated successfully', blog: updatedBlog },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const DELETE = async (req: Request, { params }: { params: Promise<{ blog: string }> }) => {
    try {
        const blogId = (await params).blog;

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
        }

        await connect();

        const blog = await Blog.findByIdAndDelete(blogId);
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}