// app/api/admin/sale/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import UnifiedSaleStream from "@/models/LiveStream";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const sale = await UnifiedSaleStream.findById(params.id);

    if (!sale) {
      return NextResponse.json({ message: "Sale not found" }, { status: 404 });
    }

    return NextResponse.json({ sale }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching sale", error },
      { status: 500 }
    );
  }
}

// PUT: Update adminStatus of a sale
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { status } = await req.json();

    const sale = await UnifiedSaleStream.findByIdAndUpdate(
      params.id,
      { adminStatus: status },
      { new: true }
    );

    if (!sale) {
      return NextResponse.json(
        { success: false, message: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, sale });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
