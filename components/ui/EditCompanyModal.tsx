"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import SuccessModal from "./SuccessModal";
import { UserRow, UpdateUserPayload } from "@/app/../lib/userAPITypes"; 
import { useCompanies } from "@/hooks/companies/useCompanies"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  onSave: (updated: UpdateUserPayload & { userId: string }) => void; 
}

type UserFormData = {
  id: string;
  name: string;
  email: string;
  companyId: string; 
  role: string;
  phone?: string;
  address?: string;
  website?: string;
  plan?: string;
  purchaseDate?: string;
  expiryDate?: string;
  status: "Active" | "In-Active";
};

export default function EditUserModal({ isOpen, onClose, user, onSave }: Props) {
  const { data: companiesData, isLoading: isLoadingCompanies, error: companiesError } = useCompanies();
  const companies = companiesData?.company || [];

  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    name: "",
    email: "",
    companyId: "", 
    role: "",
    status: "Active",
    phone: "",
    address: "",
    website: "",
    plan: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const initialCompanyId = companies.find(c => c.name === user.company)?._id || "";
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        companyId: initialCompanyId, 
        role: user.role,
        status: user.status,
        phone: user.phone || "",
        address: user.address || "",
        website: user.website || "",
        plan: user.plan || "",
        purchaseDate: user.purchaseDate || "",
        expiryDate: user.expiryDate || "",
      });
    }
  }, [user, companies]); 

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.companyId) {
      alert("Please select a company.");
      return;
    }

    const updatedPayload: UpdateUserPayload & { userId: string } = {
      userId: formData.id, 
      name: formData.name,
      email: formData.email,
      companyId: formData.companyId, 
      role: formData.role,
    
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.address && { address: formData.address }),
      ...(formData.website && { website: formData.website }),
      ...(formData.plan && { subscriptionPlan: formData.plan }),
      ...(formData.purchaseDate && { purchaseDate: formData.purchaseDate }),
      ...(formData.expiryDate && { expiryDate: formData.expiryDate }),
      isActive: formData.status === "Active", 
    };

    onSave(updatedPayload); 
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen || !user) return null;

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

          <h2 className="text-[#0B0B58] text-lg font-bold mb-6">Edit User Info</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <TextInput
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Company</label>
              {isLoadingCompanies ? (
                <div className="text-gray-500">Loading companies...</div>
              ) : companiesError ? (
                <div className="text-red-500">Error loading companies: {companiesError.message}</div>
              ) : (
                <div className="relative">
                  <select
                    value={formData.companyId}
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
            </div>

            <TextInput
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
            {/* Add other fields like phone, address, website, plan, purchaseDate, expiryDate */}
            <TextInput
              label="Phone"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextInput
              label="Address"
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <TextInput
              label="Website"
              value={formData.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
            />
            <TextInput
              label="Plan"
              value={formData.plan || ""}
              onChange={(e) => handleChange("plan", e.target.value)}
            />
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate || ""}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                className="w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate || ""}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="w-full border border-[#C3D3E2] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="User info updated successfully!"
      />
    </>
  );
}
