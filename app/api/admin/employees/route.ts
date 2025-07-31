import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Employee from "@/models/Employee";

export async function GET() {
  await connectDB();
  const employees = await Employee.find().sort({ createdAt: -1 });
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  try {
    const newEmp = await Employee.create(body);
    return NextResponse.json(newEmp, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 400 }
    );
  }
}
