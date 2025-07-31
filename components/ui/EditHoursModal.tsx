"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Select from "@/components/ui/SelectDropdown";

interface EditHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  initialValue?: string;
}

export default function EditHoursModal({
  isOpen,
  onClose,
  onSave,
  initialValue = "40",
}: EditHoursModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    onSave(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex flex-col justify-center mb-6">
          <h2 className="text-[#05004E] text-2xl font-bold">Edit Employee’s Working Hours</h2>
          <p className="text-sm text-[#737791] mt-1">Set new hours for this payroll cycle</p>
        </div>

        {/* Reusable Select Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-6">
          <Select
            label="Set weekly hours"
            selected={value}
            onChange={(val) => setValue(val)}
            options={["20", "25", "30", "35", "40", "45", "50"]}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
