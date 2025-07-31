import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import InventoryItem from "@/models/InventoryItem";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      companyId,
      sellerId,
      name,
      sportCategory,
      manufacturer,
      year,
      price,
      currentStock,
      sku,
    } = body;

    // Basic validation
    if (
      !companyId ||
      !sellerId ||
      !name ||
      !sportCategory ||
      !manufacturer ||
      !year ||
      price == null ||
      currentStock == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newItem = new InventoryItem({
      companyId,
      sellerId,
      name,
      sportCategory,
      manufacturer,
      year,
      price,
      currentStock,
      sku,
    });

    const savedItem = await newItem.save();
    return NextResponse.json(savedItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const companyId = searchParams.get("companyId");
    const sellerId = searchParams.get("sellerId");

    const filter: any = {};
    if (companyId) filter.companyId = companyId;
    if (sellerId) filter.sellerId = sellerId;

    const items = await InventoryItem.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
