"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import { AddUserPayload } from "@/app/../lib/userAPITypes";
import { useCompanies } from "@/hooks/companies/useCompanies";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onAdd: (newUser: AddUserPayload) => void;
}

type UserFormData = {
  name: string;
  email: string;
  companyId: string;
  role: string;
  password: string;
  plan?: string;
  purchaseDate?: string;
  expiryDate?: string;
};

export default function AddUserModal({ isOpen, onClose, onAdd }: Props) {
  const {
    data: companiesData,
    isLoading: isLoadingCompanies,
    error: companiesError,
  } = useCompanies();
  const companies = companiesData?.companies || [];

  const [form, setForm] = useState<UserFormData>({
    name: "",
    email: "",
    companyId: "", // Initialize with empty string for ID
    role: "super_admin", // Default role
    password: "",
    plan: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set default company if companies load and none is selected
  useEffect(() => {
    if (companies.length > 0 && !form.companyId) {
      setForm((prev) => ({ ...prev, companyId: companies[0]._id }));
    }
  }, [companies, form.companyId]);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.companyId) newErrors.companyId = "Company is required."; // Validate companyId
    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUserPayload: AddUserPayload = {
      name: form.name,
      email: form.email,
      companyId: form.companyId, // Pass the actual company ID
      role: form.role,
      password: form.password,
      // Optional fields
      ...(form.plan && { subscriptionPlan: form.plan }),
      ...(form.purchaseDate && { purchaseDate: form.purchaseDate }),
      ...(form.expiryDate && { expiryDate: form.expiryDate }),
    };

    onAdd(newUserPayload); // Pass the payload
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] rounded-2xl shadow-xl relative flex flex-col my-6 sm:my-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center z-10"
        >
          <X size={16} />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 sm:px-8 py-4">
          <h2 className="text-[#0B0B58] text-lg font-bold mb-6">Add User</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <div className="flex flex-col">
              <TextInput
                label="Name"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col">
              <TextInput
                label="Email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              {isLoadingCompanies ? (
                <div className="text-gray-500">Loading companies...</div>
              ) : companiesError ? (
                <div className="text-red-500">
                  Error loading companies: {companiesError.message}
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={form.companyId}
                    onChange={(e) => handleChange("companyId", e.target.value)}
                    className="appearance-none cursor-pointer w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              )}
              {errors.companyId && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.companyId}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="appearance-none cursor-pointer w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <ChevronDown className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col">
              <TextInput
                label="Password"
                placeholder="Enter password"
                type="password"
                value={form.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <TextInput
                label="Plan"
                placeholder="Plan details (optional)"
                value={form.plan || ""}
                onChange={(e) => handleChange("plan", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Purchase Date
              </label>
              <input
                type="date"
                value={form.purchaseDate || ""}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                className="w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate || ""}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2 pb-4">
            <button
              onClick={handleSubmit}
              className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
