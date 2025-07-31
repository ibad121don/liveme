"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const data = [
  { name: "Jan", planA: 20, planB: 35, planC: 9 },
  { name: "Feb", planA: 78, planB: 98, planC: 112 },
  { name: "March", planA: 22, planB: 77, planC: 143 },
  { name: "April", planA: 22, planB: 29, planC: 199 },
  { name: "May", planA: 28, planB: 35, planC: 99 },
];

const SubscriptionsBarChart = () => {
  return (
    <div className="h-full rounded-[20px] bg-white border border-[#F1F3F9] shadow-md p-4 sm:p-6 w-full max-w-full overflow-x-auto">
      <h2 className="text-[#1E2A53] font-semibold text-base sm:text-lg md:text-xl mb-4 text-center sm:text-left">
        Subscriptions Count
      </h2>

      <div className="w-full h-[240px] sm:h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: -20, bottom: 0 }}
            barGap={2} // tighter space between bars in the same group
            barCategoryGap="25%" // larger space between each month group
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                fontSize: 12,
                border: "1px solid #eee",
              }}
            />
            <Bar dataKey="planA" fill="#6CB9AD" barSize={16}>
              <LabelList dataKey="planA" position="top" fill="#1E2A53" fontSize={12} />
            </Bar>
            <Bar dataKey="planB" fill="#324DDD" barSize={16}>
              <LabelList dataKey="planB" position="top" fill="#1E2A53" fontSize={12} />
            </Bar>
            <Bar dataKey="planC" fill="#8C1A6A" barSize={16}>
              <LabelList dataKey="planC" position="top" fill="#1E2A53" fontSize={12} offset={10} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-4 text-xs sm:text-sm font-medium text-[#1E2A53]">
        <LegendDot color="#6CB9AD" label="Plan A" />
        <LegendDot color="#324DDD" label="Plan B" />
        <LegendDot color="#8C1A6A" label="Plan C" />
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
  </div>
);

export default SubscriptionsBarChart;
