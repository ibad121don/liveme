import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export async function requireRole(
  req: NextRequest,
  allowedRoles: string[]
): Promise<NextResponse | { id: string; role: string }> {
  const result = await verifyToken(req);
  if ("status" in result) return result as NextResponse;

  const { role } = result.user;
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return { id: result.user.id, role: result.user.role };
}
