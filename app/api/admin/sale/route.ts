import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import { UnifiedSaleStream } from "@/models/selleLivestream";
import "@/models/User";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const sales = await UnifiedSaleStream.find()
      .populate({
        path: "sellerId",
        select: "firstName lastName email",
      })
      .lean();

    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
