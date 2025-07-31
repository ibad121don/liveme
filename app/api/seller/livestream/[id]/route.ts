import { connectDB } from "@/lib/db/dbConnect";
import UnifiedSaleStream from "@/models/LiveStream";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const stream = await UnifiedSaleStream.findById(params.id);

    if (!stream) {
      return NextResponse.json(
        { success: false, message: "Stream not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stream }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    if (body.type == "direact") {
      let data = await UnifiedSaleStream.findById(body.id2);
      let tempdata = data.directSale;
      tempdata.push(body);
      const updatedStream = await UnifiedSaleStream.findByIdAndUpdate(
        body.id2,
        { directSale: tempdata },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedStream) {
        return NextResponse.json(
          { success: false, message: "Stream not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: updatedStream },
        { status: 200 }
      );
    } else {
      let data = await UnifiedSaleStream.findById(body.id2);
      let tempdata = data.salesBreak;
      tempdata.push(body);
      const updatedStream = await UnifiedSaleStream.findByIdAndUpdate(
        body.id2,
        { salesBreak: tempdata },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedStream) {
        return NextResponse.json(
          { success: false, message: "Stream not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: updatedStream },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
