"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import SuccessModal from "./SuccessModal";
import { UserRow } from "@/app/superadmin/user-management/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  onSave: (updated: UserRow) => void;
  isLoading?: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<UserRow>({
    id: "",
    name: "",
    email: "",
    company: "",
    role: "",
    joinedOn: "",
    lastLogin: "",
    status: "Active",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (field: keyof UserRow, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
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

          <h2 className="text-[#0B0B58] text-lg font-bold mb-6">
            Edit User Info
          </h2>

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
            <TextInput
              label="Company"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
            <TextInput
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
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
