import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/dbConnect';
import UnifiedSaleStream from "@/models/LiveStream";
import Company from '@/models/Company';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // === Total Revenue (Approved Sales Only) ===
    const totalRevenueData = await UnifiedSaleStream.aggregate([
      { $match: { status: 'approved', createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    // === Active Companies ===
    const activeCompanies = await Company.countDocuments({ isActive: true });

    // === Active Users ===
    const activeUsers = await User.countDocuments({ isActive: true });

    // === Subscription Revenue ===
    const subscriptionRevenue = await Company.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$subscriptionAmount' } // Use actual field
        }
      }
    ]);

    // === Plan Breakdown by Month ===
    const monthlyBreakdown = await Company.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            plan: '$subscriptionPlan'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: { month: '$_id.month', year: '$_id.year' },
          plans: {
            $push: {
              plan: '$_id.plan',
              count: '$count'
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // === Top Performing Companies ===
    const topCompaniesAgg = await UnifiedSaleStream.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$companyId',
          revenue: { $sum: { $multiply: ['$price', '$quantity'] } },
          profit: { $sum: { $multiply: ['$price', '$quantity', 0.3] } } // Example profit calc
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          _id: 0,
          name: '$company.name',
          revenue: 1,
          profit: 1
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overallPerformance: {
          totalRevenue,
          activeCompanies,
          activeUsers,
          subscriptionRevenue: subscriptionRevenue[0]?.total || 0
        },
        monthlySubscriptionPlans: monthlyBreakdown,
        topPerformingCompanies: topCompaniesAgg
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
