import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  placeholder?: string; // <-- add this
}

export default function SelectDropdown({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select an option", // default placeholder
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-2 relative">
      <label className="text-sm font-medium text-[#05004E]">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-[#C3D3E2] rounded-md focus:outline-none text-sm text-left bg-[#F9FAFB] flex items-center justify-between"
        >
          <span className={`text-[#05004E] ${!selected ? "text-gray-400" : ""}`}>
            {selected || placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[#05004E] transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#F9FAFB] border border-[#C3D3E2] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[#05004E] hover:bg-gray-100 focus:outline-none"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
