// app/api/admin/inventory/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import  { connectDB } from "@/lib/db/dbConnect";
import InventoryItem from "@/models/InventoryItem";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updated = await InventoryItem.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await InventoryItem.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
