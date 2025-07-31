import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Payroll from "@/models/Payroll";
import { verifyToken } from "@/utils/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    console.log(9);

    // ✅ Authenticate user and get companyId from token
    const result = await verifyToken(req);
    if (!("success" in result)) return result;

    const { user } = result;
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Filter payrolls by companyId from token
    const payrolls = await Payroll.find({ companyId: user.id }).populate(
      "sellerId"
    );
    return NextResponse.json({ payrolls });
  } catch (err) {
    console.error("[PAYROLL_GET]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
