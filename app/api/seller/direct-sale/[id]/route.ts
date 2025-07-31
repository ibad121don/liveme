import { connectDB } from "@/lib/db/dbConnect";
import DirectSale from "@/models/directSale";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const directItem = await DirectSale.findById(params.id);

    if (!directItem) {
      return NextResponse.json(
        { success: false, message: "Direct sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: directItem },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
