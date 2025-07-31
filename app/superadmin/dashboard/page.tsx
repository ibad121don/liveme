"use client";

import PerformanceSummary from "@/components/ui/PerformanceSummary";
import OverviewLineChart from "@/components/ui/OverviewLineChart";
import TopCompaniesTable from "@/components/ui/TopCompaniesTable";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { DashboardChartData } from "@/lib/userAPITypes";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export default function SellerDashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  const stats = dashboardData?.data?.overallPerformance
    ? [
        {
          bg: "#FFE2E5",
          iconBg: "#FA5A7D",
          icon: "/revenue.svg",
          amount: `$${(
            (dashboardData.data.overallPerformance.totalRevenue ?? 0) / 1000
          ).toFixed(0)}k`,
          label: "Total Revenue Tracked",
          change: "+8%",
          changeColor: "#FA5A7D",
        },
        {
          bg: "#E2F0FF",
          iconBg: "#3B82F6",
          icon: "/active-companies.svg",
          amount: String(
            dashboardData.data.overallPerformance.activeCompanies ?? 0
          ),
          label: "Active Companies",
          change: "+5%",
          changeColor: "#3B82F6",
        },
        {
          bg: "#DCFCE7",
          iconBg: "#22C55E",
          icon: "/user-management-active.svg",
          amount: String(
            dashboardData.data.overallPerformance.activeUsers ?? 0
          ),
          label: "Active Users",
          change: "+12%",
          changeColor: "#22C55E",
        },
        {
          bg: "#FDF6B2",
          iconBg: "#FBBF24",
          icon: "/subscription-revenue.svg",
          amount: `$${(
            (dashboardData.data.overallPerformance.subscriptionRevenue ?? 0) /
            1000
          ).toFixed(0)}k`,
          label: "Subscription Revenue",
          change: "+15%",
          changeColor: "#FBBF24",
        },
      ]
    : [];

  const revenueChartData: DashboardChartData[] = (
    dashboardData?.data?.monthlySubscriptionPlans || []
  ).map((monthData) => {
    const monthName = new Date(
      monthData._id.year,
      monthData._id.month - 1
    ).toLocaleString("en-US", { month: "short" });
    const chartEntry: DashboardChartData = { name: monthName };
    monthData.plans.forEach((plan) => {
      const displayPlanName = plan.plan
        .replace("_", " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      chartEntry[displayPlanName] = plan.count;
    });
    return chartEntry;
  });

  const chartLines = [
    { dataKey: "Plan A", stroke: "#8B5CF6", label: "Plan A" },
    { dataKey: "Plan B", stroke: "#EF4444", label: "Plan B", showDot: true },
    { dataKey: "Plan C", stroke: "#22C55E", label: "Plan C" },
  ];

  const topCompaniesData =
    dashboardData?.data?.topCompanies?.map((company) => ({
      id: company._id,
      name: company.name,
      revenue: company.revenue,
    })) || [];

  const handleExportPerformance = async (format: string) => {
    if (!dashboardData?.data?.overallPerformance) {
      alert("No performance data available to export.");
      return;
    }

    const exportFileName = `PerformanceSummary_${
      new Date().toISOString().split("T")[0]
    }`;
    const performanceData = dashboardData.data.overallPerformance;

    if (format === "CSV") {
      const csvRows = [
        ["Metric", "Value"],
        ["Total Revenue Tracked", `$${performanceData.totalRevenue ?? 0}`],
        ["Active Companies", String(performanceData.activeCompanies ?? 0)],
        ["Active Users", String(performanceData.activeUsers ?? 0)],
        [
          "Subscription Revenue",
          `$${performanceData.subscriptionRevenue ?? 0}`,
        ],
      ];

      const csvContent = csvRows
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${exportFileName}.csv`);
    } else if (format === "PDF") {
      try {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Overall Performance Summary", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        let yOffset = 30;
        const lineHeight = 10;

        const metrics = [
          {
            label: "Total Revenue Tracked",
            value: `$${performanceData.totalRevenue ?? 0}`,
          },
          {
            label: "Active Companies",
            value: String(performanceData.activeCompanies ?? 0),
          },
          {
            label: "Active Users",
            value: String(performanceData.activeUsers ?? 0),
          },
          {
            label: "Subscription Revenue",
            value: `$${performanceData.subscriptionRevenue ?? 0}`,
          },
        ];

        metrics.forEach((metric) => {
          doc.text(`${metric.label}: ${metric.value}`, 14, yOffset);
          yOffset += lineHeight;
        });

        doc.save(`${exportFileName}.pdf`);
      } catch (pdfError) {
        console.error(
          "Error generating PDF for performance summary:",
          pdfError
        );
        alert(
          `Failed to generate PDF: ${
            pdfError instanceof Error ? pdfError.message : String(pdfError)
          }. Please try again.`
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 text-lg font-semibold">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-[#05004E] text-3xl xl:text-4xl font-semibold">
          Dashboard
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex-5">
          <div className="h-full min-h-[240px]">
            <PerformanceSummary
              title="Overall Performance"
              subtitle="Summary of this month"
              stats={stats}
              onExport={handleExportPerformance}
            />
          </div>
        </div>
        <div className="flex-4">
          <div className="h-full min-h-[240px]">
            <OverviewLineChart
              title="Revenue Subscription Plan Breakdown"
              filterLabel="This year"
              data={revenueChartData}
              lines={chartLines}
              highlightDot={{
                xValue: "Jul",
                dataKey: "Plan B",
                value: 400,
                color: "#EF4444",
              }}
              yDomain={[0, 500]}
              yTicks={[0, 100, 200, 300, 400, 500]}
            />
          </div>
        </div>
      </div>
      <TopCompaniesTable companies={topCompaniesData} />
    </div>
  );
}
