import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Employee from "@/models/Employee";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const employee = await Employee.findById(params.id);
  return NextResponse.json(employee);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();

  try {
    const updated = await Employee.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    console.log("Edit ID:", params.id);
    console.log("Edit Data:", body);

    if (!updated) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Edit Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const deleted = await Employee.findByIdAndDelete(params.id);
    console.log("Delete ID:", params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
