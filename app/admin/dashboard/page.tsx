"use client";

import { useState, useEffect, useMemo } from "react";
import AdminPerformanceSummary from "@/components/ui/AdminPerformanceSummary";
import RevenueProfitChart from "@/components/ui/RevenueProfitChart";
import TotalLiveStreams from "@/components/ui/TotalLiveStreams";
import PayPeriodRevenueChart from "@/components/ui/PayPeriodRevenueChart";
import InventoryGaugeCard from "@/components/ui/InventoryGaugeCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEmployees } from "@/hooks/admin/employees/useEmployees";
import { useSales } from "@/hooks/admin/Sales/useSales";
import { useInventory } from "@/hooks/admin/Inventory/useInventory";
import { calculateSalesMetrics } from "@/utils/calculateSalesMetrics";

type TimeFilter = "Current Pay Period" | "Last 30 Days" | "1 Year" | "All Time";

export interface InventoryItem {
  name: string;
  sportCategory: string;
  manufacturer: string;
  year: number;
  price: number;
  currentStock: number;
  status: "In stock" | "Out of stock";
}

export interface InventoryRow extends InventoryItem {
  id: string;
  dropdownActions?: string[];
  [key: string]: string | string[] | number | undefined;
}

export default function AdminDashboard() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSaller, setActiveSaller] = useState(0);
  const [selectedFilter, setSelectedFilter] =
    useState<TimeFilter>("Current Pay Period");
  const [totalRevenue, setTotalRevenue] = useState<string>("$0");
  const [totalProfit, setTotalProfit] = useState<string>("$0");
  const [months, setMonths] = useState<string[]>([]);
  const [counts, setCounts] = useState<number[]>([]);

  const { data = [] } = useInventory();
  const inventoryRows: InventoryRow[] = data.map((item: any) => ({
    ...item,
    id: item._id,
    dropdownActions: ["Edit Item", "Delete Item"],
  }));

  const { employees } = useEmployees();
  const { sales } = useSales();

  // Delay rendering to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (sales && Array.isArray(sales)) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const streamCountByMonth: Record<string, number> = monthNames.reduce(
        (acc, m) => ({ ...acc, [m]: 0 }),
        {}
      );

      sales.forEach((sale) => {
        const dateStr = sale.date || sale.createdAt;
        if (!dateStr) return;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        const month = monthNames[date.getMonth()];
        streamCountByMonth[month]++;
      });

      const newMonths = Object.keys(streamCountByMonth);
      const newCounts = Object.values(streamCountByMonth);

      if (
        JSON.stringify(newMonths) !== JSON.stringify(months) ||
        JSON.stringify(newCounts) !== JSON.stringify(counts)
      ) {
        setMonths(newMonths);
        setCounts(newCounts);
      }
    }
  }, [sales]);

  useEffect(() => {
    if (employees.length > 0) {
      const activeSellersCount = employees.filter(
        (emp) => emp.role === "Seller" && emp.status === "Active"
      ).length;
      setActiveSaller(activeSellersCount);
    }
  }, [employees]);

  useEffect(() => {
    if (sales.length > 0) {
      const { totalRevenue, totalProfit } = calculateSalesMetrics(sales);
      setTotalRevenue(`$${totalRevenue.toLocaleString()}`);
      setTotalProfit(`$${totalProfit.toLocaleString()}`);
    }
  }, [sales]);

  const totalInventoryValue = useMemo(() => {
    return inventoryRows.reduce((total, item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const quantity =
        typeof item.currentStock === "string"
          ? parseInt(item.currentStock, 10)
          : item.currentStock;
      return total + price * quantity;
    }, 0);
  }, [inventoryRows]);

  return (
    <div className="flex flex-col gap-8">
      {/* Prevent hydration issues by showing fallback */}
      {!hasMounted ? (
        <div className="p-4 text-gray-500 flex justify-center items-center">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Header + Filter */}
          <div className="flex justify-between items-center pb-4">
            <h1 className="text-[#05004E] text-3xl xl:text-4xl font-semibold">
              Dashboard
            </h1>
            <div className="relative w-fit">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value as TimeFilter);
                  setIsDropdownOpen(false);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setIsDropdownOpen(false)}
                className="appearance-none w-full pr-8 text-sm text-[#0B0B58] border border-[#D0D5DD] rounded-md px-4 py-2 hover:bg-gray-100 transition font-medium cursor-pointer"
              >
                <option>Current Pay Period</option>
                <option>Last 30 Days</option>
                <option>1 Year</option>
                <option>All Time</option>
              </select>

              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#0B0B58]">
                {isDropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="flex flex-col xl:flex-row gap-2">
            <div className="w-full h-full min-h-[150px]">
              <AdminPerformanceSummary
                activeSaller={activeSaller}
                selectedFilter={selectedFilter}
                totalRevenue={totalRevenue}
                totalProfit={totalProfit}
                totalInventery={`$${totalInventoryValue.toLocaleString()}`}
              />
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-3">
              <RevenueProfitChart
                totalRevenue={totalRevenue}
                totalProfit={totalProfit}
              />
            </div>
            <div className="flex-2">
              <TotalLiveStreams months={months} counts={counts} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-3">
              <PayPeriodRevenueChart />
            </div>
            <div className="flex-2">
              <InventoryGaugeCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
