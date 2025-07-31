import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import User from "@/models/User";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  await connectDB();

  const { name, email, password, role } = await req.json();

  const exists = await User.findOne({ email });

  if (exists) {
    return NextResponse.json(
      { message: "Admin already exists" },
      { status: 400 }
    );
  }

  const hashed = await hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role,
    companyId: null,
  });

  return NextResponse.json({
    success: true,
    message: "Admin created",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
