import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import SalesBreak from "@/models/salesBreak";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const breakEntry = await SalesBreak.create(body);
    return NextResponse.json(breakEntry, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
