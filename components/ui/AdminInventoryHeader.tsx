"use client";

import { Plus, ChevronDown } from "lucide-react";

interface AdminInventoryHeaderProps {
  onAddItem: () => void;
}

export default function AdminInventoryHeader({
  onAddItem,
}: AdminInventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full bg-[#F9FAFB] py-4 px-2 sm:px-4">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#0B0B58]">
        Inventory
      </h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Add Item */}
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 text-sm text-[#0B0B58] border border-[#D0D5DD] rounded-md px-4 py-2 hover:bg-gray-100 transition font-medium"
        >
          <Plus size={14} />
          Add a new Item
        </button>

        {/* Filter Dropdown */}
        <button className="flex items-center gap-2 text-sm text-[#0B0B58] border border-[#D0D5DD] rounded-md px-4 py-2 hover:bg-gray-100 transition font-medium">
          <ChevronDown size={14} />
          Filter By Category
        </button>
      </div>
    </div>
  );
}
