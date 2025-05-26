import { updateCategoryById, deleteCategoryById } from "@/services/categoryService";
import { NextResponse } from "next/server";

interface CategoryRouteParams {
    params: { category: string };
}

export const PATCH = async (req: Request, { params }: CategoryRouteParams) => {
    try {
        const categoryId = params.category;
        const { title } = await req.json();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        return await updateCategoryById(categoryId, userId, title);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};

export const DELETE = async (req: Request, { params }: CategoryRouteParams) => {
    try {
        const categoryId = params.category;
        return await deleteCategoryById(categoryId);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
