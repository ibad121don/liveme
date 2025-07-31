import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import User from "@/models/User";
import { compare } from "bcrypt";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function generateToken({
  id,
  email,
  role,
}: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  return await new SignJWT({ id, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email, role: "seller" });
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

  const { email: userEmail, role } = user.toObject();

  const token = await generateToken({
    id: user._id.toString(),
    email: userEmail,
    role,
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
