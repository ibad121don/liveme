"use client";

import Image from "next/image";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  iconSrc?: string;
}

export default function SuccessModal({
  isOpen,
  message = "Action completed successfully!",
  iconSrc = "/success-icon.svg",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <Image src={iconSrc} alt="Success Icon" width={80} height={80} />
        </div>
        <h2 className="text-[#0B0B58] font-bold text-lg">{message}</h2>
      </div>
    </div>
  );
}
