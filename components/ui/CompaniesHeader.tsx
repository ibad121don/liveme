"use client";

import Image from "next/image";
import PrimaryButton from "./PrimaryButton";
import plus from "@/public/plus-icon.svg";

interface CompaniesHeaderProps {
  onAddCompanyClick: () => void;
}

export default function CompaniesHeader({ onAddCompanyClick }: CompaniesHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full bg-[#F9FAFB] py-4 flex-wrap gap-4">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B58]">Companies</h1>
      <div className="flex gap-4 items-center">
        <PrimaryButton
          text="Add New Company"
          icon={
            <Image
              src={plus}
              alt="Plus Icon"
              width={14}
              height={14}
              className="w-2 md:w-4"
            />
          }
          className="text-xs md:text-auto"
          onClick={onAddCompanyClick}
        />
      </div>
    </div>
  );
}
