"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import Select from "@/components/ui/SelectDropdown";
import SuccessModal from "@/components/ui/SuccessModal";

// ✅ Define Employee type
export interface Employee {
  id: string;
  name: string;
  paymentType: string;
  role: string;
  rate: string;
  status: "Active" | "Inactive";
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedEmployee: Employee) => void;
  item: any;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  item,
}: EditEmployeeModalProps) {
  const [form, setForm] = useState<Employee>({
    id: "",
    name: "",
    paymentType: "",
    role: "",
    rate: "",
    status: "Active",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setForm(item);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (key: keyof Employee, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Required";
    if (!form.rate) newErrors.rate = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSuccess({ ...form });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
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
            Edit Employee
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
            />
            <Select
              label="Payment Type"
              selected={form.paymentType}
              onChange={(val) => handleChange("paymentType", val)}
              options={["Commission", "Hourly"]}
            />
            <Select
              label="Role"
              selected={form.role}
              onChange={(val) => handleChange("role", val)}
              options={["Seller", "Manager"]}
            />
            <TextInput
              label="Rate"
              value={form.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
              error={errors.rate}
            />
            <Select
              label="Status"
              selected={form.status}
              onChange={(val) =>
                handleChange("status", val as "Active" | "Inactive")
              }
              options={["Active", "Inactive"]}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
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
        message="Employee updated successfully!"
      />
    </>
  );
}
