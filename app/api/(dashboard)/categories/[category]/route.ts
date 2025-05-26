import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: Promise<{ category: string }> }) => {
    try {
        const categoryId = (await params).category;
        const { title } = await req.json();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { title },
            { new: true }
        );

        return NextResponse.json(
            { message: 'Category updated successfully', category: updatedCategory },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ category: string }> }) => {
    try {
        const categoryId = (await params).category;

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
        }

        await connect();

        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return NextResponse.json({ message: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Category deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
