"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// Updated: short month names
const data = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
];

export default function InventoryChart() {
  const [selectedRange] = useState("Jan - Jun");

  return (
    <div className="bg-white shadow-md rounded-xl px-6 pt-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">
          Total Inventory Value (Historical)
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Bar
              dataKey="value"
              fill="#4F46E5"
              name="Inventory Value"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
