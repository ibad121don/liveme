import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Payroll from "@/models/Payroll";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const { id } = params;
  const body = await req.json();
  const { hoursWorked } = body;

  if (typeof hoursWorked !== "number") {
    return NextResponse.json({ error: "hoursWorked must be a number" }, { status: 400 });
  }

  try {
    // Get the payroll entry
    const payroll = await Payroll.findById(id);
    if (!payroll) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
    }

    // Only update if it's an hourly employee
    if (payroll.type !== "hourly") {
      return NextResponse.json({ error: "Only hourly payrolls can be updated" }, { status: 400 });
    }

    // Update hours and recalculate pay
    payroll.hoursWorked = hoursWorked;
    payroll.totalPay = (payroll.rate ?? 0) * hoursWorked;

    await payroll.save();

    return NextResponse.json({ success: true, payroll }, { status: 200 });
  } catch (error) {
    console.error("Error updating payroll:", error);
    return NextResponse.json({ error: "Failed to update payroll" }, { status: 500 });
  }
}
