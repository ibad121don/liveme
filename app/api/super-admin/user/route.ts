import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";
import { hash } from "bcrypt";
import { requireRole } from "@/utils/middleware/roleGuard";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ["admin", "super_admin"]);
  if (auth instanceof NextResponse) return auth;

  const {
    name,
    email,
    password,
    role,
    companyId,
    subscriptionPlan,
    purchaseDate,
    expiryDate,
  } = await req.json();

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      companyId,
    });

    if (subscriptionPlan || purchaseDate || expiryDate) {
      company.subscriptionPlan = subscriptionPlan || company.subscriptionPlan;
      if (purchaseDate) company.purchaseDate = new Date(purchaseDate);
      if (expiryDate) company.expiryDate = new Date(expiryDate);
      await company.save();
    }

    return NextResponse.json({
      success: true,
      message: "User created and company subscription updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: {
        id: company._id,
        name: company.name,
        subscriptionPlan: company.subscriptionPlan,
        purchaseDate: company.purchaseDate,
        expiryDate: company.expiryDate,
      },
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
  const userId = searchParams.get("user_id");
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const q = searchParams.get("q") || "";

  try {
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid user ID" },
          { status: 400 }
        );
      }

      const user = await User.findById(userId).populate("companyId");
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user,
      });
    }

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate({ path: "companyId" })
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.isActive ?? true,
      createdAt: user.createdAt,
      company: user.companyId?.name || null,
    }));

    return NextResponse.json({
      success: true,
      total,
      page,
      size,
      users: formattedUsers,
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
  const userId = searchParams.get("user_id");
  const { name, email, role, companyId } = await req.json();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (companyId) {
      const companyExists = await Company.exists({ _id: companyId });
      if (!companyExists) {
        return NextResponse.json(
          { message: "Invalid company ID" },
          { status: 400 }
        );
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (companyId) user.companyId = companyId;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
