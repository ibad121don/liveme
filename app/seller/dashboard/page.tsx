"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SuccessModal from "@/components/ui/SuccessModal";
import DataTableCard from "@/components/ui/DataTableCard";
import EditShowModal from "@/components/ui/EditShowModal";
import DeleteShowModal from "@/components/ui/DeleteShowModal";
import MostUsedPlatformChart from "@/components/ui/MostUsedPlatformChart";
import OverviewLineChart from "@/components/ui/OverviewLineChart";
import PerformanceSummary from "@/components/ui/PerformanceSummary";
import Image from "next/image";
import plus from "@/public/plus-icon.svg";
import { fetchLiveStreams } from "@/lib/api";

export interface ShowRow {
  id: string;
  date: string;
  platform: string;
  item: string;
  price: string;
  commission: string;
  status: "Completed" | "On Review" | "In Queue";
  dropdownActions?: string[];
  [key: string]: string | string[] | undefined;
}

const showColumns = [
  { label: "Date", key: "date" },
  { label: "Platform", key: "platform" },
  { label: "Item", key: "item" },
  { label: "Price", key: "price" },
  { label: "Commission", key: "commission" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const statusColors = {
  Completed: "#19CE71",
  Pending: "#F881A9",
  Draft: "#F7BE4A",
};

export default function SellerDashboard() {
  const [shows, setShows] = useState<ShowRow[]>([]);
  const [selectedShow, setSelectedShow] = useState<ShowRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [platformCost, setPlatformCost] = useState({
    TikTok: 0,
    Facebook: 0,
    Instagram: 0,
  });

  const [data, setData] = useState([
    { name: "Jan", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Feb", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Mar", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Apr", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "May", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Jun", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Jul", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Aug", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Sep", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Oct", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Nov", Sales: 0, Revenue: 0, Streams: 0 },
    { name: "Dec", Sales: 0, Revenue: 0, Streams: 0 },
  ]);

  const [stats, setStats] = useState([
    {
      bg: "#FFE2E5",
      iconBg: "#FA5A7D",
      icon: "/revenue.svg",
      amount: "$0k",
      label: "Total Revenue",
      change: "0%",
      changeColor: "#FA5A7D",
    },
    {
      bg: "#FFF4DE",
      iconBg: "#FF947A",
      icon: "/profit.svg",
      amount: "$0k",
      label: "Total Profit",
      change: "0%",
      changeColor: "#FF947A",
    },
    {
      bg: "#DCFCE7",
      iconBg: "#3CD856",
      icon: "/units-sold.svg",
      amount: "0",
      label: "Units Sold",
      change: "0%",
      changeColor: "#3CD856",
    },
    {
      bg: "#F3E8FF",
      iconBg: "#BF83FF",
      icon: "/stream.svg",
      amount: "0",
      label: "Streams Count",
      change: "0%",
      changeColor: "#BF83FF",
    },
  ]);

  useEffect(() => {
    const loadStreams = async () => {
      try {
        const currentMonthIndex = new Date().getMonth();
        const previousMonthIndex =
          currentMonthIndex > 0 ? currentMonthIndex - 1 : 0;

        const capitalize = (s: string) =>
          s.charAt(0).toUpperCase() + s.slice(1);

        let totalRevenue = 0;
        let totalProfit = 0;
        let totalSold = 0;
        let totalStreams = 0;

        let monthlyRevenue = 0;
        let monthlyProfit = 0;
        let monthlySold = 0;
        let monthlyStreams = 0;

        const updatedPlatformCost = { ...platformCost };

        const res = await fetchLiveStreams(1, 100);

        for (let stream of res.data) {
          const streamDate = new Date(stream.createdAt || stream.date);
          const monthIndex = streamDate.getMonth();
          totalStreams++;
          if (monthIndex === currentMonthIndex) monthlyStreams++;

          for (let sale of stream.salesBreak || []) {
            const cost = parseInt(sale.totalCost || "0");
            const profit = parseInt(sale.estimatedProfit || "0");
            totalRevenue += cost;
            totalProfit += profit;
            totalSold++;
            if (stream.platform in updatedPlatformCost) {
              updatedPlatformCost[stream.platform] += cost;
            }

            if (monthIndex === currentMonthIndex) {
              monthlyRevenue += cost;
              monthlyProfit += profit;
              monthlySold++;
            }
          }

          for (let sale of stream.directSale || []) {
            const cost = parseInt(sale.subtotal || "0");
            const profit = parseInt(sale.estimatedProfit || "0");
            totalRevenue += cost;
            totalProfit += profit;
            totalSold++;
            if (stream.platform in updatedPlatformCost) {
              updatedPlatformCost[stream.platform] += cost;
            }

            if (monthIndex === currentMonthIndex) {
              monthlyRevenue += cost;
              monthlyProfit += profit;
              monthlySold++;
            }
          }
        }

        const getChangePercent = (
          current: number | string,
          previous: number | string
        ) => {
          const cur =
            typeof current === "string"
              ? parseFloat(current.replace(/[^\d.-]/g, ""))
              : current;
          const prev =
            typeof previous === "string"
              ? parseFloat(previous.replace(/[^\d.-]/g, ""))
              : previous;

          if (!prev || isNaN(prev)) return "0%";
          const diff = ((cur - prev) / prev) * 100;
          const rounded = diff.toFixed(1);
          return `${diff > 0 ? "+" : ""}${rounded}%`;
        };

        const prevRevenue = data[previousMonthIndex]?.Revenue || 0;
        const prevProfit = data[previousMonthIndex]?.Revenue || 0;
        const prevSold = data[previousMonthIndex]?.Sales || 0;
        const prevStreams = data[previousMonthIndex]?.Streams || 0;

        setStats([
          {
            ...stats[0],
            amount: `$${(monthlyRevenue / 1000).toFixed(1)}k`,
            change: getChangePercent(monthlyRevenue, prevRevenue),
            changeColor: monthlyRevenue >= prevRevenue ? "#3CD856" : "#FA5A7D",
          },
          {
            ...stats[1],
            amount: `$${(monthlyProfit / 1000).toFixed(1)}k`,
            change: getChangePercent(monthlyProfit, prevProfit),
            changeColor: monthlyProfit >= prevProfit ? "#3CD856" : "#FA5A7D",
          },
          {
            ...stats[2],
            amount: monthlySold.toString(),
            change: getChangePercent(monthlySold, prevSold),
            changeColor: monthlySold >= prevSold ? "#3CD856" : "#FA5A7D",
          },
          {
            ...stats[3],
            amount: monthlyStreams.toString(),
            change: getChangePercent(monthlyStreams, prevStreams),
            changeColor: monthlyStreams >= prevStreams ? "#3CD856" : "#FA5A7D",
          },
        ]);

        setPlatformCost(updatedPlatformCost);

        const updatedData = data.map((month, idx) =>
          idx === currentMonthIndex
            ? {
                ...month,
                Sales: monthlySold,
                Revenue: monthlyProfit,
                Streams: monthlyStreams,
              }
            : month
        );
        setData(updatedData);

        const mappedRows = res.data.map((stream) => {
          const firstBreak =
            Array.isArray(stream.salesBreak) && stream.salesBreak.length > 0
              ? stream.salesBreak[0]
              : null;

          const price = firstBreak?.price ?? 0;
          const commission = firstBreak?.commission ?? 0;
          return {
            id: stream._id,
            date: new Date(
              stream.createdAt || stream.date
            ).toLocaleDateString(),
            platform: stream.platform,
            item: stream.streamTitle,
            price: `$${price}`,
            commission: `${commission}%`,
            status: capitalize(stream.saleStatus || "Pending") as
              | "Completed"
              | "On Review"
              | "In Queue",
            dropdownActions: ["View Show", "Edit Show", "Delete Show"],
          };
        });

        setShows(mappedRows);
      } catch (err) {
        console.error("Error loading streams", err);
      }
    };

    loadStreams();
  }, []);

  const handleActionClick = (row: ShowRow, action: string) => {
    setSelectedShow(row);
    if (action === "Edit Show") setEditModalOpen(true);
    if (action === "Delete Show") setDeleteModalOpen(true);
    if (action === "View Show") console.log("Viewing", row);
  };

  const handleUpdate = (updated: ShowRow) => {
    setShows((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditModalOpen(false);
    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 1500);
  };

  const handleDelete = () => {
    if (!selectedShow) return;
    setShows((prev) => prev.filter((item) => item.id !== selectedShow.id));
    setDeleteModalOpen(false);
    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 1500);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "short" });

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-3xl font-bold text-[#05004E]">Dashboard</h1>
        <PrimaryButton
          text="Create Live Stream"
          icon={<Image src={plus} alt="plus" width={16} height={16} />}
        />
      </div>

      <PerformanceSummary
        title="This Month's Performance"
        subtitle="Based on recent sales"
        stats={stats}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MostUsedPlatformChart platformCost={platformCost} />
        <OverviewLineChart
          data={data}
          title="Yearly Overview"
          filterLabel="This year"
          highlightDot={{
            xValue: currentMonth,
            dataKey: "Revenue",
            value: data[new Date().getMonth()].Revenue,
            color: "#EF4444",
          }}
          lines={[
            { dataKey: "Sales", stroke: "#A700FF", label: "Sales" },
            {
              dataKey: "Revenue",
              stroke: "#EF4444",
              showDot: true,
              label: "Revenue",
            },
            { dataKey: "Streams", stroke: "#3CD856", label: "Streams" },
          ]}
          yDomain={[0, 400]}
        />
      </div>

      <DataTableCard<ShowRow>
        title="Recent Shows"
        columns={showColumns}
        rows={shows}
        enableActions
        statusColorMap={statusColors}
        onActionClick={handleActionClick}
      />

      <EditShowModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedShow}
        onSave={handleUpdate}
      />

      <DeleteShowModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        message="Action completed successfully!"
      />
    </div>
  );
}
