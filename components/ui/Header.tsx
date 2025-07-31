"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import Cookies from "js-cookie";
import NotificationModal from "./NotificationModal";

interface HeaderProps {
  onMenuClick?: () => void;
  userRole?: string; // ✅ added
}

export default function Header({ onMenuClick, userRole }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleSignOut = () => {
    Cookies.remove("isLoggedIn");
    window.location.href = "/login"; // full page reload
  };

  return (
    <>
      <div className="flex items-center h-20 border border-t-0 border-[#E9EAF3] w-full bg-white sm:h-20 px-3 sm:px-6 shadow-[0px_2px_12px_0px_#0B162C0D] relative z-30">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-[#737791]" />
        </button>

        {/* Left: Search */}
        {/* <div className="hidden sm:block flex-1 max-w-md mr-2">
          <SearchInput />
        </div> */}

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-md absolute right-20"
          aria-label="Toggle search"
        ></button>

        <div className="flex-1" />

        {/* Right: Notification & Profile */}
        <div className="flex items-center space-x-4 " ref={dropdownRef}>
          {/* Notification Bell */}
          <Image
            src="/notifications.svg"
            alt="Notification"
            width={48}
            height={48}
            className="absolute right-60 cursor-pointer"
            onClick={handleNotificationClick}
          />

          {/* Profile with Dropdown */}
          <div
            className={`absolute w-60 top-0 right-2 bg-white rounded-b-xl p-4 z-50 ${
              dropdownOpen ? "shadow-[0px_4px_20px_#EEEEEE80]" : ""
            }`}
          >
            <div
              className="flex items-center justify-between space-x-3 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="flex gap-2 ">
                <Image
                  src="/assets/profile.jpg"
                  alt="Profile"
                  width={44}
                  height={44}
                  className="rounded-[12px] aspect-square object-cover"
                />
                <div>
                  <div className="text-[#0B162C] font-bold">Musfiq</div>
                  <div className="text-[#737791] text-sm">
                    {userRole || "User"}
                  </div>
                </div>
              </div>
              {dropdownOpen ? (
                <ChevronUp className="cursor-pointer" />
              ) : (
                <ChevronDown className="cursor-pointer" />
              )}
            </div>

            {/* ✅ Corrected conditional block syntax */}
            {dropdownOpen && (
              <div className="flex items-center cursor-pointer text-[#737791] hover:text-black border-gray-200 py-2 rounded-md px-2 mt-3 hover:bg-[#00000008] ">
                <button
                  className="flex items-center space-x-2  
            "
                  onClick={handleSignOut}
                >
                  <Image
                    src="/signout-icon.svg"
                    alt="Sign Out"
                    width={28}
                    height={28}
                  />
                  <span className="text-sm font-medium ">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {/* {mobileSearchOpen && (
        <div className="sm:hidden bg-white border-b border-[#E9EAF3] p-4">
          <SearchInput />
        </div>
      )} */}

      {isNotificationModalOpen && (
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
      )}
    </>
  );
}
