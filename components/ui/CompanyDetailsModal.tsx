"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import DeactivateCompanyConfirmModal from "./DeactivateCompanyConfirmModal";
import SuccessModal from "./SuccessModal"; // ✅ Reusable success modal
import { CompanyRow } from "@/app/superadmin/companies/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyRow | null;
  onStatusChange: (email: string, status: "Active" | "In-Active") => void;
}

export default function CompanyDetailsModal({
  isOpen,
  onClose,
  company,
  onStatusChange,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDeactivation = () => {
    setShowConfirm(false);
    setShowSuccess(true);

    setTimeout(() => {
      if (company) onStatusChange(company.email, "In-Active");
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReactivate = () => {
    setShowSuccess(true);

    setTimeout(() => {
      if (company) onStatusChange(company.email, "Active");
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  if (!isOpen || !company) return null;

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
                company.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            Status: <span className="font-normal">{company.status}</span>
          </p>

          {/* General Info */}
          <p className="font-semibold text-[#0B0B58] mb-2">General Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Company Name"
              value={company.name}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Email"
              value={company.email}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Phone Num"
              value={company.phone ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Address"
              value={company.address ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Website"
              value={company.website ?? ""}
              onChange={() => {}}
              disabled
            />
          </div>

          {/* Subscription Info */}
          <p className="font-semibold text-[#0B0B58] mb-2">
            Subscription details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <TextInput
              label="Current Plan"
              value={company.plan}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Purchase Date"
              value={company.purchaseDate ?? ""}
              onChange={() => {}}
              disabled
            />
            <TextInput
              label="Expiring on"
              value={company.expiryDate ?? ""}
              onChange={() => {}}
              disabled
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-6">
            {company.status === "Active" ? (
              <button
                className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
                onClick={() => setShowConfirm(true)}
              >
                Deactivate company
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

      {/* Confirmation Modal */}
      <DeactivateCompanyConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDeactivation}
      />

      {/* Reusable Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
        message={
          company.status === "Active"
            ? "Company deactivated successfully!"
            : "Company re-activated successfully!"
        }
      />
    </>
  );
}
