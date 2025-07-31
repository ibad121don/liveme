"use client";

import { useEffect, useState, useCallback } from "react";
import DataTableCard from "@/components/ui/DataTableCard";
import LiveStreamHeader from "@/components/ui/LiveStreamHeader";
import CreateSalesBreakModal from "@/components/ui/CreateSalesBreakModal";
import StreamDetailsModal from "@/components/ui/StreamDetailsModal";
import DirectSaleModal from "@/components/ui/DirectSaleModal";
import SellerFooter from "@/components/ui/SellerFooter";

import { fetchLiveStreams } from "@/lib/api";
import { LiveStream } from "@/lib/userAPITypes";

// Table Columns
const liveStreamColumns = [
  { label: "Stream Title", key: "streamTitle" },
  { label: "Date", key: "date" },
  { label: "Platform", key: "platform" },
  { label: "Sales", key: "sales" },
  { label: "Revenue", key: "revenue" },
  { label: "Profit", key: "profit" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

type StreamStatus =
  | "Active"
  | "Completed"
  | "draft"
  | "denied"
  | "in-review"
  | "approved";

const liveStreamStatusColors: Record<StreamStatus, string> = {
  Active: "#F24E1E",
  Completed: "#19CE71",
  draft: "#9CA3AF",
  approved: "#10B981",
  "in-review": "#FBBF24",
  denied: "#EF4444",
};

const normalizeStatus = (status: string): StreamStatus => {
  switch (status?.toLowerCase()) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "approved":
      return "approved";
    case "in-review":
    case "in_review":
      return "in-review";
    case "denied":
      return "denied";
    case "draft":
    default:
      return "draft";
  }
};

interface LiveStreamRow {
  id: string;
  streamTitle: string;
  date: string;
  platform: string;
  sales: string;
  revenue: string;
  profit: string;
  status: React.ReactNode;
  saleStatus: string;
  transactions: number;
  dropdownActions?: string[];
  salesBreak: any[];
  directSale: any[];
  [key: string]: string | string[] | number | undefined | React.ReactNode | any;
}

export default function LiveStreams() {
  const [selectedRow, setSelectedRow] = useState<LiveStreamRow | null>(null);
  const [selectedRow2, setSelectedRow2] = useState<LiveStreamRow | null>(null);

  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [breakModalOpen, setBreakModalOpen] = useState(false);
  const [directSaleModalOpen, setDirectSaleModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<LiveStreamRow[]>([]);

  const totalPages = Math.ceil(total / pageSize);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchLiveStreams(currentPage + 1, pageSize);
      const streamRows: LiveStreamRow[] = res.data.map((stream: LiveStream) => {
        const normalized = normalizeStatus(stream.saleStatus ?? "draft");
        const color = liveStreamStatusColors[normalized] || "#6B7280";
        const totalSales = stream.salesBreak.reduce(
          (acc, b) => acc + (b.spotCount || 0),
          0
        );
        const totalRevenue = stream.salesBreak.reduce(
          (acc, b) => acc + (b.totalCost || 0),
          0
        );
        const estimatedProfit = totalRevenue * 0.2;
        return {
          id: String(stream._id),
          streamTitle: stream.streamTitle,
          date: stream.date,
          platform: stream.platform,
          sales: totalSales || "0",
          revenue: totalRevenue.toString() || "0",
          profit: estimatedProfit.toFixed(2) || "0",
          salesBreak: stream.salesBreak ?? [],
          directSale: stream.directSale ?? [],
          status: (
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{normalized}</span>
            </div>
          ),
          saleStatus: stream.saleStatus ?? "draft",
          transactions: stream.transactions || 0,
          dropdownActions: ["View Details", "Create Break", "Direct Sales"],
        };
      });

      setRows(streamRows);
      setTotal(res.total || res.data.length);
    } catch (err) {
      console.error("Failed to fetch live streams:", err);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActionClick = (row: LiveStreamRow, action: string) => {
    setSelectedRow(row);
    setSelectedRow2(row);

    setPendingAction(action);
  };

  useEffect(() => {
    if (!selectedRow || !pendingAction) return;

    switch (pendingAction) {
      case "View Details":
        setModalOpen(true);
        break;
      case "Create Break":
        setBreakModalOpen(true);
        break;
      case "Direct Sales":
        setDirectSaleModalOpen(true);
        break;
    }

    setPendingAction(null); // Clear action
  }, [selectedRow, pendingAction]);

  const handleCloseAllModals = () => {
    setModalOpen(false);
    setBreakModalOpen(false);
    setDirectSaleModalOpen(false);
    setSelectedRow(null);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-6">
      <LiveStreamHeader onCreate={() => {}} />

      <DataTableCard<LiveStreamRow>
        columns={liveStreamColumns}
        rows={rows}
        statusColorMap={liveStreamStatusColors}
        enableActions
        onActionClick={handleActionClick}
        striped
      />

      {selectedRow && (
        <StreamDetailsModal
          isOpen={modalOpen}
          onClose={handleCloseAllModals}
          allData={selectedRow2}
          stream={{
            id: selectedRow.id,
            date: selectedRow.date,
            platform: selectedRow.platform,
            status: selectedRow.saleStatus,
            revenue: Number(selectedRow.revenue),
            profit: Number(selectedRow.profit),
            transactions: selectedRow.transactions,
            allData: [],
          }}
        />
      )}

      <CreateSalesBreakModal
        data={selectedRow2}
        isOpen={breakModalOpen}
        onClose={handleCloseAllModals}
      />
      <DirectSaleModal
        data={selectedRow2}
        isOpen={directSaleModalOpen}
        onClose={handleCloseAllModals}
      />

      <SellerFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
