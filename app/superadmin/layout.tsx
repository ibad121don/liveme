'use client';
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { ReactNode, useState } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { label: "Dashboard", path: "/superadmin/dashboard", icon: "dashboard" },
    { label: "Companies", path: "/superadmin/companies", icon: "companies" },
    { label: "User Management", path: "/superadmin/user-management", icon: "user-management" },
    { label: "System Config", path: "/superadmin/system-config", icon: "settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar navItems={navItems} logoName="StreamPros" isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={toggleSidebar} userRole="Super Admin"/>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
