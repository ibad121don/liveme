"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, X } from "lucide-react";

interface StatItem {
  bg: string;
  iconBg: string;
  icon: string;
  amount: string;
  label: string;
  changeColor: string;
  change?: string;
}

interface PerformanceSummaryProps {
  title?: string;
  subtitle?: string;
  stats: StatItem[];
  showExport?: boolean;
  onExport?: (format: string) => void;
}

export default function PerformanceSummary({
  title = "Overall Performance",
  subtitle = "Summary of this pay period",
  stats,
  showExport = true,
  onExport,
}: PerformanceSummaryProps) {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleExportClick = (format: string) => {
    if (onExport) {
      onExport(format);
    }
    setShowExportDropdown(false);
  };

  return (
    <div className="flex flex-col justify-between h-full rounded-[20px] border bg-white border-[#F8F9FA] shadow-[0px_4px_20px_0px_#EEEEEE80] p-4 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[#05004E] font-semibold text-xl">{title}</h2>
          <p className="text-[#737791] text-sm mt-1">{subtitle}</p>
        </div>
        {showExport && (
          <div className="relative">
            {" "}
            {/* Added relative positioning for dropdown */}
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 border border-[#E0E0E0] px-4 py-2 rounded-lg text-sm text-[#05004E] font-medium hover:bg-[#F5F6FA] transition"
            >
              <Download size={16} /> {/* Using Lucide icon */}
              Export
            </button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => handleExportClick("PDF")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExportClick("CSV")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  CSV
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-[20px] px-3 py-5"
            style={{ backgroundColor: item.bg }}
          >
            <div className="">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: item.iconBg }}
              >
                <Image src={item.icon} alt="Icon" width={20} height={20} />
              </div>
              <div className="text-[#05004E] font-bold text-xl">
                {item.amount}
              </div>
            </div>
            <div className="text-[#05004E] text-sm">{item.label}</div>
            {/* Display change only if it exists */}
            {item.change && (
              <div
                className="text-xs font-semibold mt-1"
                style={{ color: item.changeColor }}
              >
                {item.change}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
