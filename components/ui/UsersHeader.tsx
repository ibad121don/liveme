"use client";

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  onAddUserClick: () => void;
  onSearch: (query: string) => void;
}

export default function UsersHeader({ onAddUserClick }: Props) {
  const [userOpen, setUserOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] =
    useState("Filter by User");
  const [selectedCompanyFilter, setSelectedCompanyFilter] =
    useState("Filter by Company");

  const userRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node)
      ) {
        setCompanyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center w-full bg-[#F9FAFB] pt-4 gap-4 sm:gap-0">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B58]">
        User Management
      </h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2 w-full sm:w-auto">
        {/* Add User Button */}
        <button
          onClick={onAddUserClick}
          className="bg-[#1E3A8A] text-white text-sm font-semibold rounded-md px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={16} />
          Add a new user
        </button>

        {/* User Filter */}
        <div className="relative w-full sm:w-auto" ref={userRef}>
          <button
            onClick={() => setUserOpen((prev) => !prev)}
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition w-full sm:w-auto"
          >
            {selectedUserFilter}
            {userOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {userOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded shadow-md z-10">
              {["All", "Admin", "Seller"].map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedUserFilter(option);
                    setUserOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Filter */}
        <div className="relative w-full sm:w-auto" ref={companyRef}>
          <button
            onClick={() => setCompanyOpen((prev) => !prev)}
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition w-full sm:w-auto"
          >
            {selectedCompanyFilter}
            {companyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {companyOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded shadow-md z-10">
              {["All", "Tech Sales", "AB Streamer", "AVP Studios"].map(
                (option) => (
                  <div
                    key={option}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCompanyFilter(option);
                      setCompanyOpen(false);
                    }}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
