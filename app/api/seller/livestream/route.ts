// app/api/livestreams/route.ts
import { connectDB } from "@/lib/db/dbConnect";
import UnifiedSaleStream from "@/models/LiveStream";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: Request) {
  try {
    await connectDB();

    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Decode and verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { streamTitle, date, platform } = body;
    let datauser = await User.findById(decoded.id);

    // You can now access decoded fields like decoded.userId, decoded.companyId, etc.
    const newStream = await UnifiedSaleStream.create({
      streamTitle,
      date,
      platform,
      companyId: datauser.companyId, // if you're storing this in the token
      sellerId: decoded.id,
    });

    return NextResponse.json(
      { success: true, data: newStream },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const allStreams = await UnifiedSaleStream.find().sort({ date: -1 }); // newest first
    return NextResponse.json(
      { success: true, data: allStreams },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
