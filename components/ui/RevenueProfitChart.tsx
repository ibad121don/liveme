"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenueProfitChartProps = {
  totalRevenue: string;
  totalProfit: string;
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center"
      style={{ backgroundColor: hexToRgba(color, 0.15) }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
    <span className="text-sm font-medium" style={{ color }}>
      {label}
    </span>
  </div>
);

export default function RevenueProfitChart({
  totalRevenue,
  totalProfit,
}: RevenueProfitChartProps) {
  const revenue = parseFloat(totalRevenue) || 9080;
  const profit = parseFloat(totalProfit) || 5262;

  const data = [
    { name: "Jan", Revenue: 0, Profit: 0 },
    { name: "Feb", Revenue: 0, Profit: 0 },
    { name: "Mar", Revenue: 0, Profit: 0 },
    { name: "Apr", Revenue: 0, Profit: 0 },
    { name: "May", Revenue: 0, Profit: 0 },
    { name: "Jun", Revenue: 0, Profit: 0 },
    { name: "Jul", Revenue: revenue, Profit: profit },
    { name: "Aug", Revenue: 0, Profit: 0 },
    { name: "Sep", Revenue: 0, Profit: 0 },
    { name: "Oct", Revenue: 0, Profit: 0 },
  ];

  const maxY = Math.max(revenue, profit) + 10; // give buffer to visualize point

  return (
    <div className="bg-white shadow-md rounded-xl px-6 pt-6 pb-14 relative h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">
          Total revenue and total profit
        </h2>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          2025
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, maxY]} />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Line
            type="monotone"
            dataKey="Profit"
            stroke="#10b981"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Revenue"
            stroke="#4f46e5"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-8 px-4 py-1 rounded-full">
        <LegendDot color="#10b981" label="Profit" />
        <LegendDot color="#4f46e5" label="Revenue" />
      </div>
    </div>
  );
}
