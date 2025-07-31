"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  onSelect?: (option: string) => void;
}

export default function FilterDropdown({ label, options, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(!open);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div className="relative w-48" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
      >
        <span className="text-gray-700 font-medium truncate">{selected}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded shadow z-10">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
