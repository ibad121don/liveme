// app/api/admin/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import InventoryItem from "@/models/InventoryItem";

export async function GET() {
  try {
    await connectDB();
    const items = await InventoryItem.find();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Incoming Inventory Data:", body); // <-- Check what's sent

    const newItem = await InventoryItem.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding inventory item:", error); // <-- Log error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
