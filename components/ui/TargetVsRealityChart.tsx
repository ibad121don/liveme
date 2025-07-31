"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";

const data = [
  { name: "Jan", reality: 6000, target: 8000 },
  { name: "Feb", reality: 5500, target: 7500 },
  { name: "Mar", reality: 5000, target: 9000 },
  { name: "Apr", reality: 6800, target: 7000 },
  { name: "May", reality: 7000, target: 9500 },
  { name: "June", reality: 7200, target: 9400 },
  { name: "July", reality: 7400, target: 9300 },
];

export default function TargetVsRealityChart() {
  return (
    <div className="rounded-[20px] bg-white shadow-[0_4px_20px_0_#EEEEEE80] p-6 w-full">
      <h2 className="text-[#05004E] font-semibold text-xl">
        Target vs Reality
      </h2>

      <div className="w-full h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={20}>
            <XAxis dataKey="name" tick={{ fill: "#737791", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="reality"
              fill="#4AB58E"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="target"
              fill="#1E3A8A"
              radius={[4, 4, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-4">
        {/* Reality Sales */}
        <div className="flex items-center gap-4">
          <Image
            src="/reality-sales.svg"
            alt="Reality"
            width={36}
            height={36}
          />

          <div className="flex-1">
            <div className="text-[#151D48] font-semibold text-sm">Reality Sales</div>
            <div className="text-[#737791] text-xs">Products</div>
          </div>
          <div className="text-[#4AB58E] font-semibold text-lg">8.823</div>
        </div>

        {/* Target Sales */}
        <div className="flex items-center gap-4">
          <Image src="/target-sales.svg" alt="Target" width={36} height={36} />

          <div className="flex-1">
            <div className="text-[#151D48] font-semibold text-sm">Target Sales</div>
            <div className="text-[#737791] text-xs">Products</div>
          </div>
          <div className="text-[#1E3A8A] font-semibold text-lg">12.122</div>
        </div>
      </div>
    </div>
  );
}
