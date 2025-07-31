
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import DirectSale from "@/models/directSale";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const sale = await DirectSale.create(body);
    return NextResponse.json(sale, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
