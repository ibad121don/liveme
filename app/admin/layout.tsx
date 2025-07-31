"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { ReactNode, useState } from "react";

const queryClient = new QueryClient();

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    { label: "Inventory", path: "/admin/inventory", icon: "inventory" },
    { label: "Sales", path: "/admin/sales", icon: "sales" },
    { label: "Payrolls", path: "/admin/payrolls", icon: "payrolls" },
    { label: "Settings", path: "/admin/settings", icon: "settings" },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-[#F7F9FC] overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          navItems={navItems}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0">
          <Header onMenuClick={toggleSidebar} userRole="Company Admin" />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
