"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", uptime: 40, api: 80, storage: 120, avgTime: 180 },
  { name: "Feb", uptime: 60, api: 100, storage: 140, avgTime: 200 },
  { name: "Mar", uptime: 60, api: 120, storage: 150, avgTime: 240 },
  { name: "Apr", uptime: 60, api: 110, storage: 160, avgTime: 250 },
  { name: "May", uptime: 60, api: 100, storage: 150, avgTime: 240 },
  { name: "Jun", uptime: 20, api: 90, storage: 120, avgTime: 200 },
  { name: "Jul", uptime: 80, api: 110, storage: 140, avgTime: 240 },
];

const SystemUsageChart = () => {
  return (
    <div className="h-full w-full rounded-[20px] bg-white border border-[#F1F3F9] shadow-md p-6">
      {/* Header */}
      <h2 className="text-[#1E2A53] font-semibold text-lg sm:text-xl mb-4">
        System Usage & Performance
      </h2>

      {/* Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7086FD" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7086FD" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6FD195" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6FD195" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFAE4C" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FFAE4C" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07DBFA" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#07DBFA" stopOpacity={0.05} />
              </linearGradient>
            </defs>

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
              domain={[0, 300]}
              ticks={[0, 60, 120, 180, 240, 300]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                fontSize: 12,
                border: "1px solid #eee",
              }}
            />

            {/* Area layers with dot + gradient */}
            <Area
              type="monotone"
              dataKey="uptime"
              stroke="#7086FD"
              fill="url(#colorUptime)"
              strokeWidth={2}
              dot={{ stroke: "#7086FD", strokeWidth: 2, fill: "#fff", r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="api"
              stroke="#6FD195"
              fill="url(#colorApi)"
              strokeWidth={2}
              dot={{ stroke: "#6FD195", strokeWidth: 2, fill: "#fff", r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="storage"
              stroke="#FFAE4C"
              fill="url(#colorStorage)"
              strokeWidth={2}
              dot={{ stroke: "#FFAE4C", strokeWidth: 2, fill: "#fff", r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="avgTime"
              stroke="#07DBFA"
              fill="url(#colorAvg)"
              strokeWidth={2}
              dot={{ stroke: "#07DBFA", strokeWidth: 2, fill: "#fff", r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 justify-center mt-4 text-xs font-medium text-[#1E2A53]">
        <LegendDot color="#7086FD" label="System Uptime" />
        <LegendDot color="#6FD195" label="API usage" />
        <LegendDot color="#FFAE4C" label="Storage Usage" />
        <LegendDot color="#07DBFA" label="Avg Usage Time" />
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => {
  return (
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
      <span className="text-[#333] font-medium">{label}</span>
    </div>
  );
};

// Utility function to convert hex to rgba
function hexToRgba(hex: string, opacity: number): string {
  const match = hex.replace("#", "").match(/.{1,2}/g);
  if (!match) return hex;
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default SystemUsageChart;
