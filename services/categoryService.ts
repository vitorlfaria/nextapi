import connect from "@/lib/db";
import User from "@/lib/models/user";
import Category from "@/lib/models/category";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const getCategoriesByUserId = async (userId: string | null) => {
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
};

export const createCategory = async (userId: string | null, title: string) => {
    if (!userId || !Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
    }

    if (!title) {
        return NextResponse.json({ message: 'Missing category title' }, { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const category = new Category({ title, user: userId });
    await category.save();
    return NextResponse.json({ message: 'Category created successfully', category }, { status: 201 });
};

export const updateCategoryById = async (categoryId: string, userId: string | null, title: string) => {
    // Validate userId
    if (!userId || !Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid or missing user id' }, { status: 400 });
    }

    // Validate categoryId
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
    }

    // Validate title
    if (!title || title.trim() === "") {
        return NextResponse.json({ message: 'Category title cannot be empty' }, { status: 400 });
    }

    await connect();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if category exists
    const categoryToUpdate = await Category.findById(categoryId);
    if (!categoryToUpdate) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Optional: Add a check here if the category must belong to the user for an update.
    // if (categoryToUpdate.user.toString() !== userId) {
    //     return NextResponse.json({ message: 'Forbidden: Category does not belong to this user' }, { status: 403 });
    // }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true });

    if (!updatedCategory) {
        // This case might occur if the category is deleted between the findById and findByIdAndUpdate calls
        return NextResponse.json({ message: 'Category not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully', category: updatedCategory }, { status: 200 });
};

export const deleteCategoryById = async (categoryId: string) => {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return NextResponse.json({ message: 'Invalid or missing category id' }, { status: 400 });
    }
    await connect();
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
};