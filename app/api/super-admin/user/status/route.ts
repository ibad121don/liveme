import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/dbConnect';
import User from '@/models/User';
import Company from '@/models/Company';
import { hash } from 'bcrypt';
import { requireRole } from '@/utils/middleware/roleGuard';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ['super_admin']);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  const { isActive } = await req.json();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.isActive = isActive;

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}