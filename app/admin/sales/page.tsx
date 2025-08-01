"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardFooter from "@/components/ui/DashboardFooter";
import DataTableCard from "@/components/ui/DataTableCard";
import SalesHeader from "@/components/ui/AdminSalesHeader";
import SuccessModal from "@/components/ui/SuccessModal";
import StreamDetailsModal from "@/components/ui/StreamDetailsModal";
import { useSales } from "@/hooks/admin/Sales/useSales";

const salesColumns = [
  { label: "Date", key: "date" },
  { label: "Seller", key: "seller" },
  { label: "Platform", key: "platform" },
  { label: "Sales", key: "sales" },
  { label: "Revenue", key: "revenue" },
  { label: "Profit", key: "profit" },
  { label: "Year", key: "year" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

interface SalesRow {
  id: string;
  _id: string;
  date: string;
  seller: string;
  platform: string;
  sales: number;
  revenue: number;
  profit: number;
  year: number;
  adminStatus: "Pending" | "Approved" | "Rejected";
  status: "Pending" | "Approved" | "Rejected";
  salesBreak: any[];
  directSale: any[];
  dropdownActions?: string[];
  [key: string]: string | string[] | number | undefined;
}

interface SalesDisplayRow extends SalesRow {
  revenue: string;
  profit: string;
}

const statusColorMap = {
  Pending: "#FACC15",
  Approved: "#22C55E",
  Rejected: "#EF4444",
};

export default function ManageSales() {
  const { sales, isLoading, isError, error, updateStatus } = useSales();

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesRow | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  // Fetch token and set company ID
  useEffect(() => {
    const breaktoken = async () => {
      const tempData = await localStorage.getItem("userData");
      if (tempData) {
        const user = JSON.parse(tempData);
        setCompanyId(user?.user?.companyId || null);
      }
    };
    breaktoken();
  }, []);

  const filteredSales = sales.filter((s: any) => s.companyId === companyId);

  const salesRows: SalesRow[] = filteredSales.map((s: any) => {
    const totalSalesFromBreaks =
      s.salesBreak?.reduce((acc: number, breakItem: any) => {
        return (
          acc +
          (breakItem.selectedProducts?.reduce(
            (sum: number, product: any) => sum + (product.quantity || 0),
            0
          ) || 0)
        );
      }, 0) || 0;

    const totalSalesFromDirect =
      s.directSale?.reduce((acc: number, directItem: any) => {
        return (
          acc +
          (directItem.selectedProducts?.reduce(
            (sum: number, product: any) => sum + (product.quantity || 0),
            0
          ) || 0)
        );
      }, 0) || 0;

    const totalUnitsSold = totalSalesFromBreaks + totalSalesFromDirect;

    const totalRevenue =
      (s.salesBreak?.reduce((acc: number, item: any) => acc + (item.totalCost || 0), 0) || 0) +
      (s.directSale?.reduce((acc: number, item: any) => acc + (item.subtotal || 0), 0) || 0);

    const totalProfit =
      (s.salesBreak?.reduce((acc: number, item: any) => acc + (item.estimatedProfit || 0), 0) || 0) +
      (s.directSale?.reduce((acc: number, item: any) => acc + (item.estimatedProfit || 0), 0) || 0);

    return {
      id: s._id,
      _id: s._id,
      date: new Date(s.createdAt).toLocaleDateString(),
      seller: s.sellerName || "Unknown Seller",
      platform: s.platform || "N/A",
      sales: totalUnitsSold,
      revenue: totalRevenue,
      profit: totalProfit,
      salesBreak: s.salesBreak ?? [],
      directSale: s.directSale ?? [],
      year: new Date(s.createdAt).getFullYear(),
      adminStatus: s.adminStatus || "Pending",
      status: s.adminStatus || "Pending",
      dropdownActions: ["View Details", "Accept Report", "Reject Report"],
    };
  });

  const totalPages = Math.ceil(salesRows.length / pageSize);
  const paginatedRows = salesRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleActionClick = (row: SalesDisplayRow, action: string) => {
    if (action === "Accept Report") {
      updateStatus.mutate({ id: row._id, status: "Approved" });
      setSuccessMessage("Report accepted successfully!");
    } else if (action === "Reject Report") {
      updateStatus.mutate({ id: row._id, status: "Rejected" });
      setSuccessMessage("Report rejected.");
    } else if (action === "View Details") {
      const originalRow = salesRows.find((r) => r._id === row._id);
      if (originalRow) {
        setSelectedSale(originalRow);
        setDetailsModalOpen(true);
      }
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 2000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const totalRevenue = useMemo(() => {
    return salesRows.reduce((acc, row) => acc + (Number(row.revenue) || 0), 0);
  }, [salesRows]);

  const pendingSellersCount = useMemo(() => {
    const pendingSellers = new Set(
      salesRows
        .filter((row) => row.adminStatus === "Pending")
        .map((row) => row.seller)
    );
    return pendingSellers.size;
  }, [salesRows]);

  if (isLoading) return <div>Loading sales...</div>;
  if (isError) return <div>Error loading sales: {(error as Error).message}</div>;

  return (
    <div className="flex flex-col gap-6">
      <SalesHeader totalRevenue={totalRevenue} pendingSellers={pendingSellersCount} />

      <DataTableCard<SalesDisplayRow>
        columns={salesColumns}
        rows={paginatedRows.map((row) => ({
          ...row,
          revenue: `$${row.revenue.toLocaleString()}`,
          profit: `$${row.profit.toLocaleString()}`,
        }))}
        statusColorMap={statusColorMap}
        enableActions
        onActionClick={handleActionClick}
      />

      <DashboardFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDownload={(format) => {
          console.log(`Downloading Sales as ${format}`);
        }}
      />

      <SuccessModal
        isOpen={!!successMessage}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />

      {selectedSale && (
        <StreamDetailsModal
          allData={selectedSale}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          stream={{
            id: selectedSale?.id || "",
            date: selectedSale?.date || "",
            platform: selectedSale?.platform || "",
            status: selectedSale?.status || "",
            revenue: selectedSale?.revenue || 0,
            profit: selectedSale?.profit || 0,
            transactions: selectedSale?.sales || 0,
            allData: selectedSale || {},
          }}
        />
      )}
    </div>
  );
}
