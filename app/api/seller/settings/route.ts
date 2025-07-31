import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User"; // ✅ Only UserModel used now
import { connectDB } from "@/lib/db/dbConnect";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing Bearer token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    const userId = decoded.id;
    const userEmail = decoded.email;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token payload" },
        { status: 400 }
      );
    }

    const { firstName, lastName, password, companyName, contactEmail, role } =
      await req.json();

    const updateData: any = {
      firstName,
      lastName,
      companyName,
      contactEmail,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (role && ["seller", "admin", "superadmin"].includes(role)) {
      updateData.role = role;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Missing Bearer token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const userId = decoded.id;

    const user = await UserModel.findById(userId).select(
      "firstName lastName companyName contactEmail role email"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
