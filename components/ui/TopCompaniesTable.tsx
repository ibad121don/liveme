"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { name: "StreamPros", revenue: 55000, profit: 20000 },
  { name: "MediaMatrix", revenue: 42500, profit: 16800 },
  { name: "ContentHive", revenue: 39000, profit: 14200 },
  { name: "VisionCast", revenue: 36200, profit: 13000 },
  { name: "BroadReach", revenue: 30000, profit: 10500 },
];

export default function TopCompaniesChart() {
  return (
    <div className="h-full rounded-[20px] bg-white border border-[#F1F3F9] shadow-md p-6 w-full">
      <h2 className="text-[#1E2A53] font-semibold text-lg sm:text-xl mb-4">
        Top 5 Performing Companies
      </h2>

      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: -15, bottom: 30 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#8D96B2", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#8D96B2", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString()}`
              }
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                fontSize: 12,
                border: "1px solid #eee",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: 12,
                color: "#1E2A53",
              }}
              iconType="circle"
            />
            <Bar
              dataKey="revenue"
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="profit"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
              name="Profit"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
