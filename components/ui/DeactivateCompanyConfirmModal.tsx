"use client";

import { AlertCircle } from "lucide-react";

interface DeactivateCompanyConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeactivateCompanyConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeactivateCompanyConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 sm:p-10 text-center shadow-[0_4px_60px_rgba(0,0,0,0.1)]">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#FF3B30] rounded-full p-3">
            <AlertCircle className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[#0B0B58] text-lg sm:text-xl font-bold mb-3">
          Are you sure you want to deactivate?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#737791] mb-8">
          This user will lose access to the platform
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <button
            onClick={onConfirm}
            className="w-full sm:w-[140px] bg-[#1E3A8A] hover:bg-[#162d6c] text-white text-sm px-4 py-2.5 rounded-lg font-semibold transition-all"
          >
            Yes, Deactivate
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-[140px] bg-[#E5E7EB] hover:bg-[#d2d6dc] text-gray-500 text-sm px-4 py-2.5 rounded-lg font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
