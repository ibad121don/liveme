"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  navItems: NavItem[];
  logoSrc?: string; // logo image path, e.g., "/dabang.svg"
  logoName?: string; // company name, e.g., "Dabang"
}

export default function Sidebar({
  isOpen = true,
  onClose,
  navItems,
  logoSrc = "/dabang.svg", // default fallback
  logoName = "Dabang",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#0000004f] z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col gap-4 bg-[#FFFFFF] text-[#737791] 
        w-72 h-full py-4 px-4 sm:px-8 
        shadow-[0px_2px_12px_0px_#0B162C0D] border border-[#E9EAF3]`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 text-3xl font-bold text-[#151D48]">
          <div className="flex justify-center items-center rounded-lg w-11 h-11 bg-[#1E3A8A]">
            <Image src={logoSrc} alt="logo" width={24} height={24} />
          </div>
          <h2>{logoName}</h2>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2 sm:space-y-4 flex-1">
          {navItems.map(({ label, path, icon }) => {
            const active = pathname === path;
            const iconSrc = active ? `/${icon}-active.svg` : `/${icon}.svg`;
            const textClass = active ? "text-white font-semibold" : "";

            return (
              <div
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-4 py-2 px-3 rounded-md cursor-pointer transition-all duration-150 ${textClass} ${
                  active ? "bg-[#1E3A8A]" : "hover:bg-[#0000000c]"
                }`}
              >
                <Image src={iconSrc} alt={label} width={24} height={24} />
                <span className="text-sm sm:text-base">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
