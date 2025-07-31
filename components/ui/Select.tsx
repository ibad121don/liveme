"use client";

import React from "react";

interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = "",
}: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-sm">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
