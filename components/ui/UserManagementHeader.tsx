"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

interface UserManagementHeaderProps {
  onAddUserClick: () => void;
}

export default function UserManagementHeader({ onAddUserClick }: UserManagementHeaderProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [selectedUserFilter, setSelectedUserFilter] = useState("Filter by User");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("Filter by Company");

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);
  const toggleCompanyDropdown = () => setCompanyDropdownOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }

      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (user: string) => {
    setSelectedUserFilter(user);
    setUserDropdownOpen(false);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompanyFilter(company);
    setCompanyDropdownOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 w-full bg-[#F9FAFB] py-4">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B58]">
        User Management
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Add New User */}
        <button
          onClick={onAddUserClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] hover:bg-[#162d6c] text-white text-sm font-medium rounded-lg transition"
        >
          <Plus size={16} />
          Add a new user
        </button>

        {/* Filter by User */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={toggleUserDropdown}
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
          >
            <span className="text-gray-700 font-medium">
              {selectedUserFilter}
            </span>
            {userDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {userDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {["All", "Sellers", "Admins"].map((user) => (
                <div
                  key={user}
                  onClick={() => handleUserSelect(user)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {user}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter by Company */}
        <div className="relative" ref={companyDropdownRef}>
          <button
            onClick={toggleCompanyDropdown}
            className="flex items-center justify-between gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
          >
            <span className="text-gray-700 font-medium">
              {selectedCompanyFilter}
            </span>
            {companyDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {companyDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {["All", "Tech Sales", "AB Streamer", "AVP Studios"].map((company) => (
                <div
                  key={company}
                  onClick={() => handleCompanySelect(company)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {company}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
