import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Dashboard from "@/models/Dashboard";

// GET: Fetch all shows or stats if ?stats=true
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const stats = searchParams.get("stats");

    if (stats === "true") {
      // Fetch stats only for completed shows
      const shows = await Dashboard.find({ status: "Completed" });

      const totalRevenue = shows.reduce(
        (acc: number, show: any) => acc + parseFloat(show.price),
        0
      );

      const totalCommission = shows.reduce(
        (acc: number, show: any) => acc + parseFloat(show.commission),
        0
      );

      const unitsSold = shows.length;
      const streamsCount = shows.length * 10;

      return NextResponse.json({
        revenue: totalRevenue,
        profit: totalRevenue - totalCommission,
        unitsSold,
        streamsCount,
      });
    } else {
      // Fetch all shows
      const dashboards = await Dashboard.find().sort({ createdAt: -1 });
      return NextResponse.json(dashboards, { status: 200 });
    }
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// POST: Create a new dashboard show entry
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newShow = await Dashboard.create(body);

    return NextResponse.json(newShow, { status: 201 });
  } catch (error: any) {
    console.error("Error creating dashboard entry:", error.message);
    return NextResponse.json(
      { message: "Failed to create dashboard entry" },
      { status: 500 }
    );
  }
}
