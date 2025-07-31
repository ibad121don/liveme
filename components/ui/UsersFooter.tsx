"use client";

import { ChevronLeft, ChevronRight, Download } from "lucide-react";

interface UsersFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownload?: () => void; // Optional download handler
}

export default function UsersFooter({
  currentPage,
  totalPages,
  onPageChange,
  onDownload,
}: UsersFooterProps) {
  const goToPrevious = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center flex-wrap gap-4 bg-white rounded-xl py-4 px-4 sm:px-6 border border-gray-100 w-full">
      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 0}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition ${
            currentPage === 0
              ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              : "bg-[#1E3A8A] text-white hover:bg-[#3B4DC3]"
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
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition ${
            currentPage === totalPages - 1
              ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              : "bg-[#1E3A8A] text-white hover:bg-[#3B4DC3]"
          }`}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Download Button */}
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-2 text-sm font-medium text-[#1E3A8A] hover:text-[#3B4DC3]"
        >
          <Download size={18} />
          Download CSV
        </button>
      )}
    </div>
  );
}
