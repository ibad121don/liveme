"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import Select from "@/components/ui/SelectDropdown";
import SuccessModal from "@/components/ui/SuccessModal";
import { EmployeeRow } from "@/types/employee";
// import type { EmployeeRow } from "@/app/admin/settings/page";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEmployee: any) => void;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: AddEmployeeModalProps) {
  const [form, setForm] = useState({
    name: "",
    paymentType: "Commission",
    role: "Seller",
    rateValue: "",
    rateUnit: "%",
    status: "Active",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const getAvailableUnits = (paymentType: string) => {
    switch (paymentType) {
      case "Commission":
        return ["%", "points", "tokens"];
      case "Hourly":
        return ["$/hr", "€/hr"];
      case "Salary":
        return ["$/mo", "€/mo"];
      default:
        return [];
    }
  };

  const handleChange = (key: string, value: string) => {
    if (key === "paymentType") {
      const newUnit = getAvailableUnits(value)[0] || "";
      setForm((prev) => ({
        ...prev,
        [key]: value,
        rateUnit: newUnit,
        rateValue: "", // reset rate on type change
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }

    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.rateValue.trim()) {
      newErrors.rateValue = "Rate value is required";
    } else if (isNaN(Number(form.rateValue)) || Number(form.rateValue) <= 0) {
      newErrors.rateValue = "Rate must be a valid number";
    }

    if (!form.rateUnit) newErrors.rateUnit = "Select a rate unit";
    if (!form.paymentType) newErrors.paymentType = "Select a payment type";
    if (!form.role) newErrors.role = "Select a role";
    if (!form.status) newErrors.status = "Select status";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formattedRate = `${form.rateValue}${form.rateUnit}`;
    onSuccess({
      name: form.name,
      role: form.role,
      paymentType: form.paymentType,
      rate: formattedRate,
      status: form.status,
    });

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
            Add New Employee
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
              options={["Commission", "Hourly", "Salary"]}
            />
            {errors.paymentType && (
              <p className="text-xs text-red-500 mt-1 col-span-1">
                {errors.paymentType}
              </p>
            )}

            <Select
              label="Role"
              selected={form.role}
              onChange={(val) => handleChange("role", val)}
              options={["Seller", "Admin", "Super Admin"]}
            />
            {errors.role && (
              <p className="text-xs text-red-500 mt-1 col-span-1">
                {errors.role}
              </p>
            )}

            <div className="col-span-1">
              <TextInput
                label="Rate Value"
                value={form.rateValue}
                onChange={(e) =>
                  handleChange(
                    "rateValue",
                    e.target.value.replace(/[^\d.]/g, "")
                  )
                }
                error={errors.rateValue}
              />
            </div>

            <div className="col-span-1">
              <Select
                label="Rate Unit"
                selected={form.rateUnit}
                onChange={(val) => handleChange("rateUnit", val)}
                options={getAvailableUnits(form.paymentType)}
              />
              {errors.rateUnit && (
                <p className="text-xs text-red-500 mt-1">{errors.rateUnit}</p>
              )}
            </div>

            <Select
              label="Status"
              selected={form.status}
              onChange={(val) => handleChange("status", val)}
              options={["Active", "Inactive"]}
            />
            {errors.status && (
              <p className="text-xs text-red-500 mt-1 col-span-1">
                {errors.status}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold px-10 py-2 rounded-xl transition-all"
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Employee added successfully!"
      />
    </>
  );
}
