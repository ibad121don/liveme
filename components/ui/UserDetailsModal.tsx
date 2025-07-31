"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import DeactivateCompanyConfirmModal from "./DeactivateCompanyConfirmModal";
import SuccessModal from "./SuccessModal";
import { UserRow } from "@/app/superadmin/user-management/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  isLoading?: boolean;
  onStatusChange: (id: string, status: "Active" | "In-Active") => void;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onStatusChange,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDeactivation = () => {
    setShowConfirm(false);
    setShowSuccess(true);

    setTimeout(() => {
      if (user) onStatusChange(user.id, "In-Active");
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReactivate = () => {
    setShowSuccess(true);

    setTimeout(() => {
      if (user) onStatusChange(user.id, "Active");
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          {/* Status Indicator */}
          <p className="text-sm font-semibold mb-4">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                user.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Status: <span className="font-normal">{user.status}</span>
          </p>

          {/* General Info */}
          <p className="font-semibold text-[#0B0B58] mb-2">General Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Name"
              value={user.name}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Email"
              value={user.email}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Password"
              value={user.password ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Company"
              value={user.company}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Role"
              value={user.role}
              onChange={() => {}}
              disabled
            />
          </div>

          {/* Subscription Info */}
          <p className="font-semibold text-[#0B0B58] mb-2">
            Company&apos;s Subscription details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <TextInput
              label="Current Plan"
              value={user.plan ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Purchase Date"
              value={user.purchaseDate ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Expiring on"
              value={user.expiryDate ?? ""}
              onChange={() => {}}
              disabled
            />
          </div>

          <div className="flex justify-center pt-6">
            {user.status === "Active" ? (
              <button
                className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
                onClick={() => setShowConfirm(true)}
              >
                Deactivate Account
              </button>
            ) : (
              <button
                className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
                onClick={handleReactivate}
              >
                Re-Activate
              </button>
            )}
          </div>
        </div>
      </div>

      <DeactivateCompanyConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDeactivation}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        message={
          user.status === "Active"
            ? "User deactivated successfully!"
            : "User re-activated successfully!"
        }
      />
    </>
  );
}
