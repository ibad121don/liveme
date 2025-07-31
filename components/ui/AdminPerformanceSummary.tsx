"use client";

import Image from "next/image";

type TimeFilter = "Current Pay Period" | "Last 30 Days" | "1 Year" | "All Time";

interface Stat {
  label: string;
  value: string;
  showChange: boolean;
  change?: string;
}

const defaultStats: Record<TimeFilter, Stat[]> = {
  "Current Pay Period": [
    {
      label: "Total Revenue",
      value: "$125,000",
      change: "+0.0%",
      showChange: true,
    },
    {
      label: "Total Profit",
      value: "$25,000",
      change: "+0%",
      showChange: true,
    },
    {
      label: "Active sellers",
      value: "20",
      showChange: false,
    },
    {
      label: "Value of Inventory on Hand",
      value: "$65,000",
      showChange: false,
    },
  ],
  "Last 30 Days": [
    {
      label: "Total Revenue",
      value: "$400,000",
      change: "+9.0%",
      showChange: true,
    },
    {
      label: "Total Profit",
      value: "$80,000",
      change: "+6.5%",
      showChange: true,
    },
    {
      label: "Active sellers",
      value: "48",
      showChange: false,
    },
    {
      label: "Value of Inventory on Hand",
      value: "$62,000",
      showChange: false,
    },
  ],
  "1 Year": [
    {
      label: "Total Revenue",
      value: "$3.2M",
      change: "+22.4%",
      showChange: true,
    },
    {
      label: "Total Profit",
      value: "$680,000",
      change: "+18.9%",
      showChange: true,
    },
    {
      label: "Active sellers",
      value: "132",
      showChange: false,
    },
    {
      label: "Value of Inventory on Hand",
      value: "$58,000",
      showChange: false,
    },
  ],
  "All Time": [
    {
      label: "Total Revenue",
      value: "$8.5M",
      change: "+35.0%",
      showChange: true,
    },
    {
      label: "Total Profit",
      value: "$1.7M",
      change: "+30.0%",
      showChange: true,
    },
    {
      label: "Active sellers",
      value: "235",
      showChange: false,
    },
    {
      label: "Value of Inventory on Hand",
      value: "$70,000",
      showChange: false,
    },
  ],
};

interface AdminPerformanceSummaryProps {
  selectedFilter: TimeFilter;
  activeSaller: number;
  totalRevenue: string;
  totalProfit: string;
  totalInventery: string;
}

export default function AdminPerformanceSummary({
  selectedFilter,
  activeSaller,
  totalRevenue,
  totalProfit,
  totalInventery,
}: AdminPerformanceSummaryProps) {
  const stats = defaultStats[selectedFilter].map((stat) => {
    if (stat.label === "Total Revenue") {
      return { ...stat, value: totalRevenue };
    } else if (stat.label === "Total Profit") {
      return { ...stat, value: totalProfit };
    } else if (stat.label == "Value of Inventory on Hand") {
      return { ...stat, value: totalInventery };
    } else {
      return stat;
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex-1 bg-[#1E3A8A1A] rounded-xl px-6 py-6 text-left space-y-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#1E3A8A] font-semibold">
                {item.label}
              </p>
              {item.showChange && item.change && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[#1E3A8A]">
                  {item.change}
                  <Image
                    src="/arrow-rise.svg"
                    alt="Change"
                    width={16}
                    height={16}
                  />
                </div>
              )}
            </div>
            <h3 className="text-[1.6rem] font-bold text-[#1e2b65]">
              {item.label === "Active sellers" ? activeSaller : item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
