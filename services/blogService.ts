import connect from "@/lib/db";
import Blog from "@/lib/models/blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface BlogFilter {
    user: string;
    category: string;
    $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
    createdAt?: { $gte?: Date; $lte?: Date };
}

export const getAllBlogs = async (
    userId: string,
    categoryId: string,
    searchKeywords: string | null,
    startDate: string | null,
    endDate: string | null,
    page: number,
    limit: number
) => {
    if (!userId || !Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
    }

    await connect();

    const filter: BlogFilter = {
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
}

export const createBlog = async (userId: string, categoryId: string, title: string, description: string) => {
    if (!userId || !Types.ObjectId.isValid(userId) || !categoryId || !Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json({ message: 'Invalid or missing user/category id' }, { status: 400 });
    }
    await connect();
    const blog = new Blog({ title, description, user: userId, category: categoryId });
    await blog.save();
    return NextResponse.json({ message: 'Blog created successfully' }, { status: 201 });
}

export const getBlogById = async (blogId: string) => {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
    }
    await connect();
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog, { status: 200 });
};

export const updateBlogById = async (blogId: string, data: { title?: string; description?: string }) => {
    const { title, description } = data;
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
    }

    await connect();

    const updatedBlogData: any = {};
    if (title) updatedBlogData.title = title;
    if (description) updatedBlogData.description = description;

    if (Object.keys(updatedBlogData).length === 0) {
        return NextResponse.json({ message: 'No fields to update provided' }, { status: 400 });
    }

    const blog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, { new: true });

    if (!blog) {
        return NextResponse.json({ message: 'Blog not found or no changes made' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Blog updated successfully', blog }, { status: 200 });
};

export const deleteBlogById = async (blogId: string) => {
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return NextResponse.json({ message: 'Invalid or missing blog id' }, { status: 400 });
    }
    await connect();
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
        return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
};