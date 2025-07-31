"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Updated: More granular pay periods instead of just months
const data = [
  { payPeriod: "Jan 1-15", revenue: 500, profit: 400 },
  { payPeriod: "Jan 16-31", revenue: 500, profit: 400 },
  { payPeriod: "Feb 1-15", revenue: 500, profit: 300 },
  { payPeriod: "Feb 16-28", revenue: 500, profit: 400 },
  { payPeriod: "Mar 1-15", revenue: 500, profit: 400 },
  { payPeriod: "Mar 16-31", revenue: 500, profit: 200 },
  { payPeriod: "Apr 1-15", revenue: 500, profit: 400 },
  { payPeriod: "Apr 16-30", revenue: 500, profit: 100 },
  { payPeriod: "May 1-15", revenue: 500, profit: 400 },
  { payPeriod: "May 16-31", revenue: 500, profit: 400 },
  { payPeriod: "June 1-15", revenue: 500, profit: 400 },
  { payPeriod: "June 16-30", revenue: 500, profit: 400 },
];

export default function PayPeriodRevenueChart() {
  const [selectedRange] = useState("January - June");

  return (
    <div className="bg-white shadow-md rounded-xl px-6 pt-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">
          Pay Period Revenue and Profit
        </h2>

        <div className="relative">
          <button className="flex items-center border border-gray-300 rounded-md px-4 py-1 text-sm text-gray-700 hover:bg-gray-100">
            {selectedRange}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="payPeriod" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="profit"
              fill="#86efac"
              name="Profit"
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="revenue"
              fill="#818cf8"
              name="Revenue"
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
