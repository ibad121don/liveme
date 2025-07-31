import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/dbConnect';
import SystemConfig from '@/models/SystemConfig';
import { requireRole } from '@/utils/middleware/roleGuard';

// GET - Fetch system config
export async function GET(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ['super_admin']);
  if (auth instanceof NextResponse) return auth;

  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({});
    }

    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to fetch config' }, { status: 500 });
  }
}

// PUT - Update system config
export async function PUT(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ['super_admin']);
  if (auth instanceof NextResponse) return auth;

  const updates = await req.json();

  try {
    const config = await SystemConfig.findOne();

    if (!config) {
      return NextResponse.json({ message: 'System config not found' }, { status: 404 });
    }

    Object.keys(updates).forEach((key) => {
      if (typeof updates[key] === 'object' && updates[key] !== null) {
        Object.assign(config[key], updates[key]);
      } else {
        config[key] = updates[key];
      }
    });

    await config.save();

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      config,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Failed to update config' }, { status: 500 });
  }
}
