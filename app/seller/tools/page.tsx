"use client";

import { useState } from "react";
import BreakCalculatorModal from "@/components/ui/BreakCalculatorModal"; // Update the path as needed

const tools = [
  {
    label: "Break Calculator",
    description:
      "Calculate optimal per-spot pricing for live stream box breaks based on selected inventory.",
    color: "#EC4899",
    icon: "◼",
  },
  {
    label: "PYT Creator",
    description:
      "Manage team-based box breaks, spot assignment, pricing, and buyer tracking.",
    color: "#10B981",
    icon: "⬤",
  },
];

export default function Tools() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-120 p-6 sm:p-10 bg-white">
      <h2 className="text-[#05004E] font-semibold text-2xl sm:text-3xl mb-6">
        Tools & Resources
      </h2>

      <div className="flex flex-wrap gap-4">
        {tools.map((tool, i) => (
          <div
            key={i}
            className="relative mypath px-4 py-10 pl-6 pr-5 cursor-pointer"
            style={{ maxWidth: "260px" }}
            onClick={() => {
              if (tool.label === "Break Calculator") {
                setIsModalOpen(true);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: tool.color }}
              >
                {tool.icon}
              </span>
              <h3 className="font-semibold text-[#1E3A8A]">{tool.label}</h3>
            </div>
            <p className="text-sm text-[#000000] leading-snug">
              {tool.description}
            </p>
          </div>
        ))}
      </div>

      {/* Modal component */}
      <BreakCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
