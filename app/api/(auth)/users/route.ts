import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const user = new User(body);
        await user.save();
        return NextResponse.json({ message: "User created successfully", user: user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        const { userId, newUsername } = body;

        await connect();
        if (!userId || !newUsername) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, { username: newUsername }, { new: true });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully", user: user }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        console.log(userId);


        await connect();
        if (!userId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(new Types.ObjectId(userId));
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully", user: user }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
}
