import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import Company from "@/models/Company";
import User from "@/models/User";
import { hash } from "bcrypt";
import { requireRole } from "@/utils/middleware/roleGuard";

export async function POST(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ["super_admin"]);
  if (auth instanceof NextResponse) return auth;

  try {
    const {
      name,
      email,
      phone,
      address,
      website,
      subscriptionPlan,
      purchaseDate,
      expiryDate,
      password,
      confirmPassword,
    } = await req.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const existingCompany = await Company.findOne({
      $or: [{ email }, { name }],
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: "Company with the same name or email already exists" },
        { status: 409 }
      );
    }

    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(now.getMonth() + 1);

    const company = await Company.create({
      name,
      email,
      phone,
      address,
      website,
      subscriptionPlan,
      purchaseDate,
      expiryDate,
      isActive: true,
      password: await hash(password, 10),
      superAdminId: auth.id,
    });

    return NextResponse.json({
      success: true,
      message: "Company created",
      company,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ["super_admin"]);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("company_id");
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const q = searchParams.get("q") || "";

  try {
    if (companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        return NextResponse.json(
          { message: "Company not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, company });
    }

    const query = q ? { name: { $regex: q, $options: "i" } } : {};
    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      total,
      page,
      size,
      companies,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ["super_admin"]);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("company_id");
  const { name, adminEmail, subscriptionPlan, expiryDate, isActive } =
    await req.json();

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    company.name = name || company.name;
    company.subscriptionPlan = subscriptionPlan || company.subscriptionPlan;
    company.expiryDate = expiryDate ? new Date(expiryDate) : company.expiryDate;
    company.isActive = isActive !== undefined ? isActive : company.isActive;

    await company.save();

    if (adminEmail) {
      const admin = await User.findOne({
        companyId: company._id,
        role: "company_admin",
      });

      if (admin) {
        admin.email = adminEmail;
        await admin.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
