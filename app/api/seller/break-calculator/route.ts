// app/api/break-calculator/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import BreakCalculator from "@/models/BreakCalculator";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const created = await BreakCalculator.create(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
