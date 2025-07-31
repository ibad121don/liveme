import { connectDB } from "@/lib/db/dbConnect";
import Dashboard from "@/models/Dashboard";
import { NextResponse } from "next/server";

// GET /api/seller/dashboard/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const show = await Dashboard.findById(params.id);

    if (!show) {
      return NextResponse.json({ message: "Show not found" }, { status: 404 });
    }

    return NextResponse.json(show, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching show" }, { status: 500 });
  }
}

// PUT /api/seller/dashboard/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updatedData = await req.json();

    const updatedShow = await Dashboard.findByIdAndUpdate(
      params.id,
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedShow) {
      return NextResponse.json({ message: "Show not found" }, { status: 404 });
    }

    return NextResponse.json(updatedShow, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating show" }, { status: 500 });
  }
}

// DELETE /api/seller/dashboard/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedShow = await Dashboard.findByIdAndDelete(params.id);

    if (!deletedShow) {
      return NextResponse.json({ message: "Show not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Show deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error deleting show" }, { status: 500 });
  }
}