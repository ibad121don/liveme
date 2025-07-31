"use client";

import { AlertCircle, X } from "lucide-react";

interface DeleteInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteInventoryItemModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteInventoryItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-10 h-10 bg-[#FF3B30] text-white flex items-center justify-center rounded-full">
            <AlertCircle size={20} />
          </div>
          <h2 className="text-[#05004E] text-lg font-bold">
            Are you sure you want to delete?
          </h2>
          <p className="text-sm text-[#737791]">
            This will remove the item from inventory permanently.
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onConfirm}
              className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
            >
              Yes, Delete
            </button>
            <button
              onClick={onClose}
              className="bg-[#E0E0E0] text-[#737791] font-medium px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
