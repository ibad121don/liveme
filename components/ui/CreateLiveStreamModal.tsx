"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import { createStream } from "@/lib/api";

interface CreateLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    streamTitle: string;
    date: string;
    platform: string;
  }) => void;
}

const platformOptions = ["Instagram", "Facebook", "TikTok"];

export default function CreateLiveStreamModal({
  isOpen,
  onClose,
  onCreate,
}: CreateLiveStreamModalProps) {
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDate, setStreamDate] = useState("");
  const [platform, setPlatform] = useState("Fanatics Live");
  const [errors, setErrors] = useState({ title: "", date: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStreamTitle("");
      setPlatform("Instagram");
      setErrors({ title: "", date: "" });

      const today = new Date().toISOString().split("T")[0];
      setStreamDate(today);
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {
      title: streamTitle.trim() ? "" : "Stream title is required",
      date: streamDate ? "" : "Stream date is required",
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.date;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    createStream({ streamTitle, date: streamDate, platform });
    // onCreate({ streamTitle, date: streamDate, platform });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
        >
          <X size={16} />
        </button>

        {/* Modal Title */}
        <h2 className="text-[#0B0B58] text-2xl font-bold mb-6 text-center">
          Create a New Live Stream
        </h2>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <TextInput
              label="Stream Title"
              placeholder="Enter stream name"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0B0B58] mb-1">
              Stream Date
            </label>
            <input
              type="date"
              value={streamDate}
              onChange={(e) => setStreamDate(e.target.value)}
              className="w-full border border-[#D0D5DD] rounded-md px-4 py-2 text-sm text-[#0B0B58] hover:bg-gray-100 transition"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Platform Dropdown */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-[#0B0B58] mb-1">
              Streaming Platform
            </label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setIsDropdownOpen(false)}
                className="appearance-none w-full pr-8 text-sm text-[#0B0B58] border border-[#D0D5DD] rounded-md px-4 py-2 hover:bg-gray-100 transition font-medium cursor-pointer"
              >
                {platformOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#0B0B58]">
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-[#D08E10] mb-6 text-center">
          * You’ll be able to assign sellers later from the stream report
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold py-3 rounded-lg transition-all"
        >
          Create Stream
        </button>
      </div>
    </div>
  );
}
