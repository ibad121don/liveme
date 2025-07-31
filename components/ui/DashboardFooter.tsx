"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface UsersFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload?: (format: string) => void;
}

export default function UsersFooter({
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
}: UsersFooterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const goToPrevious = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleDownload = (format: string) => {
    setSelectedFormat(format);
    setDropdownOpen(false);
    onDownload?.(format);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 bg-white rounded-xl py-4 px-4 sm:px-6 border border-gray-100 w-full">
      {/* Pagination Controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 0}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white transition ${
            currentPage === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#1E3A8A] hover:bg-[#3B4DC3]"
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === currentPage ? "bg-[#1E3A8A]" : "bg-[#D1D5DB]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages - 1}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white transition ${
            currentPage === totalPages - 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#1E3A8A] hover:bg-[#3B4DC3]"
          }`}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Download Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center gap-3 px-4 py-2 rounded-full transition w-full sm:w-auto"
        >
          <div className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1E3A8A] hover:bg-[#3B4DC3]">
            <Download size={20} color="white" />
          </div>
          <span className="text-sm sm:text-base font-semibold text-gray-800 whitespace-nowrap">
            Download as {selectedFormat}
          </span>
          {dropdownOpen ? (
            <ChevronUp strokeWidth={2.5} size={18} className="text-gray-600" />
          ) : (
            <ChevronDown
              strokeWidth={2.5}
              size={18}
              className="text-gray-600"
            />
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute w-48 right-0 bg-white rounded shadow-md z-10 mt-2">
            {["PDF", "CSV", "Excel"].map((format) => (
              <div
                key={format}
                onClick={() => handleDownload(format)}
                className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
              >
                {format}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
