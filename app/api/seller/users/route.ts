import { connectDB } from "@/lib/db/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/utils/middleware/roleGuard";

export async function GET(req: NextRequest) {
  await connectDB();
  const auth = await requireRole(req, ["seller"]);

  if (auth instanceof NextResponse) return auth;

  const existingUser = await User.findById(auth.id).select("-password");

  if (!existingUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(existingUser);
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const auth = await requireRole(req, ["seller"]);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { firstName, lastName, companyName, contactEmail, password } = body;

  const update: any = {
    firstName,
    lastName,
    companyName,
    contactEmail,
  };

  if (password) update.password = password;

  const updatedUser = await User.findByIdAndUpdate(auth.id, update, {
    new: true,
  }).select("-password");

  return NextResponse.json(updatedUser);
}
