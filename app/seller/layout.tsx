'use client';
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { ReactNode, useState } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { label: "Dashboard", path: "/seller/dashboard", icon: "dashboard" },
    { label: "Inventory", path: "/seller/inventory", icon: "inventory" },
    { label: "Live Streams", path: "/seller/live-streams", icon: "live-stream" },
    { label: "Tools", path: "/seller/tools", icon: "tools" },
    { label: "Settings", path: "/seller/settings", icon: "settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F7F9FC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar navItems={navItems} isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={toggleSidebar} userRole="Seller"/>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
