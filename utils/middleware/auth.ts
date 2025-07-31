import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = req.cookies.get("token")?.value;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    console.log("Token payload:", payload);

    return {
      success: true,
      user: payload as {
        id: string;
        email: string;
        role: string;
      },
    };
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export async function generateToken(payload: jose.JWTPayload) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  return token;
}
