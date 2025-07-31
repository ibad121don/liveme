import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import UnifiedSaleStream from "@/models/LiveStream";
import InventoryItem from "@/models/InventoryItem";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const filter = searchParams.get("period") || "all";

    const matchDate = (() => {
      if (filter === "last30")
        return { date: { $gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) } };
      if (filter === "year")
        return { date: { $gte: new Date(Date.now() - 365 * 24 * 3600 * 1000) } };
      return {};
    })();

    // 🛠️ Revenue + Profit — use $toDouble to ensure numeric type
    const revenueProfit = await UnifiedSaleStream.aggregate([
      { $match: matchDate },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $toDouble: "$revenue" } },
          profit: { $sum: { $toDouble: "$profit" } },
        },
      },
    ]);

    // 🛠️ Active Sellers based on streamStatus = "Active"
    const activeSellers = await UnifiedSaleStream.distinct("sellerId", {
      streamStatus: "Active",
    });

    // 🛠️ Inventory Value = price × currentStock
    const inventoryValue = await InventoryItem.aggregate([
      { $match: {} },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$price", "$currentStock"] } },
        },
      },
    ]);

    return NextResponse.json({
      revenue: revenueProfit[0]?.revenue ?? 0,
      profit: revenueProfit[0]?.profit ?? 0,
      activeSellers: activeSellers.length,
      inventoryValue: inventoryValue[0]?.totalValue ?? 0,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
