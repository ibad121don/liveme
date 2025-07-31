"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useState } from "react";
import { DotProps } from "recharts";

type ChartDataItem = {
  name: string;
  [key: string]: number | string;
};

type LineConfig = {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  showDot?: boolean;
  label?: string;
};

interface OverviewLineChartProps {
  title?: string;
  filterLabel?: string;
  data: ChartDataItem[];
  showLegend?: boolean;
  lines: LineConfig[];
  yDomain?: [number, number];
  yTicks?: number[]; // <-- ✅ Added this
  highlightDot?: {
    xValue: string;
    dataKey: string;
    value: number;
    color: string;
  };
}

const OverviewLineChart = ({
  title = "Yearly Overview",
  filterLabel = "This year",
  data,
  showLegend = true,
  lines,
  yDomain = [0, 400],
  yTicks,
  highlightDot,
}: OverviewLineChartProps) => {
  const [filter] = useState(filterLabel);

  const CustomDot = ({
    cx,
    cy,
    payload,
  }: DotProps & { payload?: ChartDataItem }) => {
    if (
      !highlightDot ||
      !payload ||
      payload.name !== highlightDot.xValue ||
      payload[highlightDot.dataKey] !== highlightDot.value
    )
      return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={highlightDot.color}
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="h-full rounded-[20px] border bg-white border-[#F8F9FA] shadow-[0px_4px_20px_0px_#EEEEEE80] p-6 sm:p-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-[#05004E] font-semibold text-lg sm:text-xl">
          {title}
        </h2>
        <button className="flex items-center gap-2 border border-[#E0E0E0] px-3 sm:px-4 py-2 rounded-lg text-sm text-[#05004E] font-medium hover:bg-[#F5F6FA] transition">
          <span>{filter}</span>
          <svg
            width="12"
            height="8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1l5 5 5-5"
              stroke="#05004E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-[260px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: -10, left: -20 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#737791", fontSize: 10 }}
              textAnchor="end"
              height={50}
              interval={0}
            />
            <YAxis
              tick={{ fill: "#737791", fontSize: 10 }}
              domain={yDomain}
              ticks={yTicks}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                fontSize: 12,
                border: "1px solid #eee",
              }}
            />
            {highlightDot && (
              <ReferenceLine
                x={highlightDot.xValue}
                stroke={highlightDot.color}
                strokeDasharray="4 2"
              />
            )}
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth ?? 3}
                dot={
                  highlightDot?.dataKey === line.dataKey && highlightDot ? (
                    <CustomDot />
                  ) : (
                    line.showDot || false
                  )
                }
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Legend */}
        {showLegend && (
          <div className="absolute flex gap-3 text-sm text-[#05004E] bottom-12 translate-x-[25%] md:translate-x-[130%] xl:translate-x-[70%]">
            {lines.map((line) => (
              <div key={line.dataKey} className="flex items-center gap-1">
                <div
                  className="w-[14px] h-[14px] aspect-square"
                  style={{ backgroundColor: line.stroke }}
                ></div>
                <div>{line.label ?? line.dataKey}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewLineChart;
