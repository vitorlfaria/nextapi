import connect from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const createUser = async (body: any) => {
    const user = new User(body);
    await connect();
    await user.save();
    return NextResponse.json({ message: "User created successfully", user: user }, { status: 201 });
}

export const getAllUsers = async () => {
    await connect();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
}

export const updateUser = async (body: any) => {
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
}

export const deleteUser = async (userId: string) => {
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
}