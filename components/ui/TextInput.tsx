"use client";

import { LucideIcon } from "lucide-react";

interface TextInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
  error?: string;
  name?: string;
  autoComplete?: string;
}

export default function TextInput({
  label,
  placeholder = "",
  value,
  onChange,
  type = "text",
  disabled = false,
  rightIcon: RightIcon,
  onRightIconClick,
  error,
  name,
  autoComplete,
}: TextInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#05004E] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full border ${
            error ? "border-red-500" : "border-[#C3D3E2]"
          } bg-[#F9FAFB] rounded-md px-3 py-2 text-sm 
          text-gray-800 placeholder:text-gray-700 
          focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          } focus:border-transparent disabled:opacity-50 pr-10`}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <RightIcon size={18} />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
