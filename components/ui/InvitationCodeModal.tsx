"use client";

import { useState } from "react";
import { Copy, Share2, X } from "lucide-react";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  link?: string;
}

export default function InvitationCodeModal({
  isOpen,
  onClose,
  link = "https://sample-link-here",
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white w-full max-w-xl sm:max-w-2xl rounded-2xl px-6 py-10 sm:p-12 text-center shadow-xl"
        style={{
          boxShadow: "0 0 0 10px white, 0px 25px 80px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/success-icon.svg"
            alt="Success"
            width={80}
            height={80}
            className="drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <h2 className="text-[#05004E] text-2xl sm:text-3xl font-bold mb-2">
          Invitation Code Generated!
        </h2>

        {/* Subtitle */}
        <p className="text-[#737791] text-sm sm:text-base mb-6 font-medium max-w-md mx-auto">
          Share this code with the company admin to help them access the platform.
        </p>

        {/* Code Box */}
        <input
          className="border border-gray-300 rounded-md px-4 py-3 w-full max-w-md mx-auto text-sm text-center font-semibold text-[#737791] bg-gray-50 mb-8"
          value={link}
          readOnly
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#162d6c] text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy Code"}
          </button>

          <button
            onClick={() => alert("Share functionality coming soon")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#162d6c] text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
