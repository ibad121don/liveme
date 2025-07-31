"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import SuccessModal from "@/components/ui/SuccessModal";
import type { ShowRow } from "@/app/seller/dashboard/page";

interface EditShowModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShowRow | null;
  onSave: (updated: ShowRow) => void;
}

export default function EditShowModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditShowModalProps) {
  const [form, setForm] = useState<ShowRow | null>(item);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setForm(item);
    setErrors({});
  }, [item]);

  if (!isOpen || !form) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.date.trim()) newErrors.date = "Date is required";
    if (!form.platform.trim()) newErrors.platform = "Platform is required";
    if (!form.item.trim()) newErrors.item = "Item is required";
    if (!form.status) newErrors.status = "Status is required";

    if (!form.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(form.price.replace(/[^0-9.]/g, "")))) {
      newErrors.price = "Invalid price value";
    }

    if (!form.commission.trim()) {
      newErrors.commission = "Commission is required";
    } else if (isNaN(Number(form.commission.replace(/[^0-9.]/g, "")))) {
      newErrors.commission = "Invalid commission value";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrency = (value: string): string => {
    const numeric = value.replace(/[^0-9.]/g, "");
    return numeric ? `$${numeric}` : "";
  };

  const handleChange = (key: keyof ShowRow, value: string) => {
    let updatedValue = value;
    if (key === "price" || key === "commission") {
      updatedValue = formatCurrency(value);
    }

    setForm((prev) => (prev ? { ...prev, [key]: updatedValue } : null));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSave = () => {
    if (!form || !validate()) return;
    onSave(form);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-2xl font-bold mb-6 text-left">
            Edit Show
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              {errors.date && (
                <span className="text-red-500 text-xs mt-1">{errors.date}</span>
              )}
            </div>

            <TextInput
              label="Platform"
              value={form.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
              error={errors.platform}
            />

            <TextInput
              label="Item"
              value={form.item}
              onChange={(e) => handleChange("item", e.target.value)}
              error={errors.item}
            />

            <TextInput
              label="Price"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              error={errors.price}
            />

            <TextInput
              label="Commission"
              value={form.commission}
              onChange={(e) => handleChange("commission", e.target.value)}
              error={errors.commission}
            />

   
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold px-10 py-2 rounded-xl transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Show updated successfully!"
      />
    </>
  );
}
