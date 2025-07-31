import { connectDB } from "@/lib/db/dbConnect";
import SalesBreak from "@/models/salesBreak";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const breakItem = await SalesBreak.findById(params.id);

    if (!breakItem) {
      return NextResponse.json({ success: false, message: "Sales break not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: breakItem }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
