import connect from "@/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import Blog from "@/lib/models/blog";

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

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
        }

        await connect();

        const filter: any = {
            user: userId,
            category: categoryId
        };

        if (searchKeywords) {
            filter.$or = [
                { title: { $regex: searchKeywords, $options: 'i' } },
                { description: { $regex: searchKeywords, $options: 'i' } }
            ]
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        } else if (startDate) {
            filter.createdAt = {
                $gte: new Date(startDate)
            }
        } else if (endDate) {
            filter.createdAt = {
                $lte: new Date(endDate)
            }
        }

        const skip = (page - 1) * limit;

        const blogs = await Blog.find(filter).sort({ createdAt: "asc" }).skip(skip).limit(limit);

        return NextResponse.json({ blogs });
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

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
        }

        await connect();

        const blog = new Blog({ title, description, user: userId, category: categoryId });

        await blog.save();

        return NextResponse.json({ message: 'Blog created successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}