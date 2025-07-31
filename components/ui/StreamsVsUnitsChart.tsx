"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

// Original Data
const rawData = [
  { name: "Monday", streams: 280, units: 240 },
  { name: "Tuesday", streams: 330, units: 230 },
  { name: "Wednesday", streams: 120, units: 460 },
  { name: "Thursday", streams: 310, units: 140 },
  { name: "Friday", streams: 250, units: 230 },
  { name: "Saturday", streams: 310, units: 260 },
  { name: "Sunday", streams: 360, units: 210 },
];

export default function StreamsVsUnitsChart() {
  const [animatedData, setAnimatedData] = useState(
    rawData.map((d) => ({ ...d, streams: 0, units: 0 }))
  );

  useEffect(() => {
    let start: number | null = null;
    const duration = 1000;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      const newData = rawData.map((d) => ({
        name: d.name,
        streams: d.streams * progress,
        units: d.units * progress,
      }));

      setAnimatedData(newData);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="rounded-[20px] border border-[#F8F9FA] bg-white shadow-[0_4px_20px_0_#EEEEEE80] p-6 w-full">
      <h2 className="text-[#05004E] font-semibold text-xl">
        Streams vs Units Sold
      </h2>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={animatedData}
            barCategoryGap="10%"
            margin={{ top: 15, right: 10, bottom: 0, left: -30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#737791", fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis tick={{ fill: "#737791", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                fontSize: 12,
                border: "1px solid #eee",
              }}
            />
            <Bar
              dataKey="streams"
              fill="#0095FF"
              radius={[4, 4, 0, 0]}
              barSize={18}
              name="Live stream count"
            />
            <Bar
              dataKey="units"
              fill="#00E096"
              radius={[4, 4, 0, 0]}
              barSize={18}
              name="Unit Sales"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 ">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0095FF]" />
          <span className="text-sm text-[#05004E]">Live stream count</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00E096]" />
          <span className="text-sm text-[#05004E]">Unit Sales</span>
        </div>
      </div>
    </div>
  );
}
