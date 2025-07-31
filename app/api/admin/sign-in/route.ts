import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import User from "@/models/User";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import type { JWTPayload } from "jose";
import { log } from "console";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function generateToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();
  console.log("Admin sign-in request received", { email });
  console.log("Request body:", { email, password });

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email, role: "admin" });
  console.log("User found:", user ? user._id : "No user found");
  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  const response = NextResponse.json({
    success: true,
    message: "Logged in successfully",
    token,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  response.cookies.set("isLoggedIn", "true");
  response.cookies.set("userRole", user.role);

  return response;
}
