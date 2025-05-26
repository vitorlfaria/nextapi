import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/api/authMiddleware";


export const config = {
    matcher: "/api/:path*"
}

export default function middleware(request: Request) {
    const authResult = authMiddleware(request);

    if (!authResult.isvalid) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}