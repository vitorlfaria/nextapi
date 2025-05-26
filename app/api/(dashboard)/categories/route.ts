import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const categories = await Category.find({ user: userId });

        return NextResponse.json(categories, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const { title } = await req.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const category = new Category({ title, user: userId });
        category.save();

        return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}