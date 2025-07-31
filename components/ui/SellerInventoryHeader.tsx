"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SellerInventoryHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Filter By Category");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category: string) => {
    console.log("Selected category:", category);
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  return (
    <div className="flex justify-between items-center w-full bg-[#F9FAFB] py-4">
      {/* Left Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B58]">
        Inventory
      </h1>

      {/* Right Dropdown */}
      <div className="relative w-48" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center  justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-transparent hover:bg-gray-100 transition"
        >
          <span className="text-gray-700  font-medium truncate">
            {selectedCategory}
          </span>
          {dropdownOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-transparent font-semibold rounded shadow-md z-10">
            {["All", "Electronics", "Apparel", "Accessories"].map((category) => (
              <div
                key={category}
                onClick={() => handleSelect(category)}
                className="px-4 py-2 text-sm font-semi bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
