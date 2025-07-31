import { connectDB } from "@/lib/db/dbConnect";
import Company from "@/models/Company";
import { NextRequest, NextResponse } from "next/server";

// Get company (first one found)
export async function GET() {
  try {
    await connectDB();
    const company = await Company.findOne();
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company);
  } catch (error) {
    console.error("GET /api/company error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Update or create company
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Company.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/company error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
