import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/dbConnect';
import Company from '@/models/Company';
import { requireRole } from '@/utils/middleware/roleGuard';

export async function PATCH(req: NextRequest) {
  await connectDB();

  const auth = await requireRole(req, ['super_admin']);
  if (auth instanceof NextResponse) return auth;

  const { isActive } = await req.json();

  if (typeof isActive !== 'boolean') {
    return NextResponse.json({ message: '`isActive` must be a boolean' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('company_id');
    const company = await Company.findById(companyId);
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    company.isActive = isActive;
    await company.save();

    return NextResponse.json({
      success: true,
      message: `Company ${isActive ? 'activated' : 'deactivated'} successfully`,
      company
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
