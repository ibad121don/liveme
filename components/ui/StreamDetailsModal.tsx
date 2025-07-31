"use client";

import { useEffect, useState } from "react";
import {
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Edit3,
  Check,
  AlertCircle,
} from "lucide-react";
import { useLiveStreams } from "@/hooks/dashboard/useLiveStreams";

interface Transaction {
  id: number;
  date: string;
  time: string;
  buyer: string;
  item: string;
  price: number;
  qty: number;
  revenue: number;
  profit: number;
}

interface StreamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: {
    id: string;
    date: string;
    platform: string;
    status: string;
    revenue: number;
    profit: number;
    transactions: number;
    allData: any;
  };
  allData: any;
}

export default function StreamDetailsModal({
  isOpen,
  onClose,
  stream,
  allData,
}: StreamDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"direct" | "breaks">("direct");
  const [isEditing, setIsEditing] = useState(false);

  const directSalesData: Transaction[] = [
    {
      id: 1,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "John Smith",
      item: "Football Hobby Box",
      price: 25,
      qty: 1,
      revenue: 25,
      profit: 25,
    },
    {
      id: 2,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "Joshua",
      item: "Shirt",
      price: 15,
      qty: 1,
      revenue: 15,
      profit: 15,
    },
    {
      id: 3,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "Henry Sails",
      item: "Football Hobby Box",
      price: 25,
      qty: 1,
      revenue: 25,
      profit: 25,
    },
    {
      id: 4,
      date: "1/2/2025",
      time: "16:15:22",
      buyer: "Mike Johnson",
      item: "Baseball Card Pack",
      price: 12,
      qty: 2,
      revenue: 24,
      profit: 24,
    },
    {
      id: 5,
      date: "1/2/2025",
      time: "16:45:33",
      buyer: "Sarah Wilson",
      item: "Basketball Jersey",
      price: 35,
      qty: 1,
      revenue: 35,
      profit: 35,
    },
    {
      id: 6,
      date: "1/2/2025",
      time: "17:22:11",
      buyer: "David Brown",
      item: "Hockey Puck Set",
      price: 18,
      qty: 3,
      revenue: 54,
      profit: 54,
    },
    {
      id: 7,
      date: "1/2/2025",
      time: "17:55:44",
      buyer: "Lisa Davis",
      item: "Tennis Racket",
      price: 45,
      qty: 1,
      revenue: 45,
      profit: 45,
    },
    {
      id: 8,
      date: "1/2/2025",
      time: "18:12:33",
      buyer: "Robert Miller",
      item: "Golf Ball Set",
      price: 22,
      qty: 2,
      revenue: 44,
      profit: 44,
    },
    {
      id: 9,
      date: "1/2/2025",
      time: "18:33:55",
      buyer: "Emily Garcia",
      item: "Soccer Cleats",
      price: 65,
      qty: 1,
      revenue: 65,
      profit: 65,
    },
    {
      id: 10,
      date: "1/2/2025",
      time: "19:01:22",
      buyer: "James Martinez",
      item: "Swimming Goggles",
      price: 28,
      qty: 1,
      revenue: 28,
      profit: 28,
    },
  ];

  const breaksData: Transaction[] = [
    {
      id: 1,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "",
      item: "Football Hobby Box",
      price: 25,
      qty: 1,
      revenue: 25,
      profit: 25,
    },
    {
      id: 2,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "",
      item: "Shirt",
      price: 15,
      qty: 1,
      revenue: 15,
      profit: 15,
    },
    {
      id: 3,
      date: "1/2/2025",
      time: "15:03:06",
      buyer: "",
      item: "Football Hobby Box",
      price: 25,
      qty: 1,
      revenue: 25,
      profit: 25,
    },
    {
      id: 4,
      date: "1/2/2025",
      time: "16:15:22",
      buyer: "",
      item: "Baseball Card Pack",
      price: 12,
      qty: 2,
      revenue: 24,
      profit: 24,
    },
    {
      id: 5,
      date: "1/2/2025",
      time: "16:45:33",
      buyer: "",
      item: "Basketball Jersey",
      price: 35,
      qty: 1,
      revenue: 35,
      profit: 35,
    },
    {
      id: 6,
      date: "1/2/2025",
      time: "17:22:11",
      buyer: "",
      item: "Hockey Puck Set",
      price: 18,
      qty: 3,
      revenue: 54,
      profit: 54,
    },
    {
      id: 7,
      date: "1/2/2025",
      time: "17:55:44",
      buyer: "",
      item: "Tennis Racket",
      price: 45,
      qty: 1,
      revenue: 45,
      profit: 45,
    },
    {
      id: 8,
      date: "1/2/2025",
      time: "18:12:33",
      buyer: "",
      item: "Golf Ball Set",
      price: 22,
      qty: 2,
      revenue: 44,
      profit: 44,
    },
    {
      id: 9,
      date: "1/2/2025",
      time: "18:33:55",
      buyer: "",
      item: "Soccer Cleats",
      price: 65,
      qty: 1,
      revenue: 65,
      profit: 65,
    },
    {
      id: 10,
      date: "1/2/2025",
      time: "19:01:22",
      buyer: "",
      item: "Swimming Goggles",
      price: 28,
      qty: 1,
      revenue: 28,
      profit: 28,
    },
  ];
  console.log(activeTab, allData.salesBreak, allData.directSale);

  const currentData =
    activeTab === "direct" ? allData.directSale : allData.salesBreak;
  // const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  // const totalProfit = currentData.reduce((sum, item) => sum + item.profit, 0);
  // Calculate total profit and revenue from all transactions
  const { totalRevenue, totalProfit } = currentData.reduce(
    (acc: any, transaction: any) => {
      transaction.selectedProducts.forEach((product: any) => {
        const qty = parseInt(product.quantity || "0");
        const price = parseFloat(product.price || "0");
        const costPrice = parseFloat(product.costPrice || "0");

        const revenue = qty * price;
        const profit = transaction.estimatedProfit;

        acc.totalRevenue += revenue;
        acc.totalProfit += profit;
      });

      return acc;
    },
    { totalRevenue: 0, totalProfit: 0 }
  );

  // Check if report can be edited
  const canEdit = stream.status === "draft" || stream.status === "denied";
  const isInReview = stream.status === "in-review";
  const isApproved = stream.status === "approved";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "denied":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "in-review":
        return "In Review";
      case "denied":
        return "Denied";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const handleSubmitForReview = () => {
    console.log("Submitting report for review...");
    // Here you would typically make an API call to update the status
  };

  const handleSaveChanges = () => {
    console.log("Saving changes...");
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };
  const { data, isLoading, isError } = useLiveStreams(1, 10);

  useEffect(() => {
    if (data) {
      console.log("Live stream data:", data);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
            transition: background 0.2s ease;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }
        `}
      </style>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4">
        <div className="bg-white w-full max-w-5xl rounded-2xl relative shadow-lg h-full overflow-hidden mx-2 sm:mx-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-105"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Header Section */}
          <div className="text-[#0B0B58] p-4 sm:px-6 pt-6 pb-0 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Stream Details
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[#19191D] text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{stream.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{stream.platform}</span>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      stream.status
                    )}`}
                  >
                    {getStatusText(stream.status)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium"
                  >
                    <Edit3 size={14} />
                    Edit Report
                  </button>
                )}

                {isEditing && (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-medium"
                    >
                      <Check size={14} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {(stream.status === "draft" || stream.status === "denied") &&
                  !isEditing && (
                    <button
                      onClick={handleSubmitForReview}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all duration-200 text-sm font-medium"
                    >
                      <AlertCircle size={14} />
                      Submit for Review
                    </button>
                  )}
              </div>
            </div>

            {/* Status Messages */}
            {stream.status === "denied" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Report Denied:</strong> Please review and edit your
                  report before resubmitting.
                </p>
              </div>
            )}

            {isInReview && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Under Review:</strong> This report is currently being
                  reviewed by an admin.
                </p>
              </div>
            )}

            {isApproved && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Approved:</strong> This report has been approved and
                  counts towards your payroll.
                </p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 sm:px-6">
            {/* Tabs */}
            <div className="flex gap-1 mb-3 bg-[#F9FAFB] border border-[#C3D3E2] p-1 rounded-xl w-full sm:w-fit overflow-hidden">
              <button
                onClick={() => setActiveTab("direct")}
                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  activeTab === "direct"
                    ? "bg-white text-[#1E3A8A] shadow-md"
                    : "text-[#000000] hover:text-[#1E3A8A]"
                }`}
              >
                Direct Sales
              </button>
              <button
                onClick={() => setActiveTab("breaks")}
                className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  activeTab === "breaks"
                    ? "bg-white text-[#1E3A8A] shadow-md"
                    : "text-[#000000] hover:text-[#1E3A8A]"
                }`}
              >
                Breaks
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F9FAFB] border border-[#C3D3E2] rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#1E3A8A] mb-1">
                      TOTAL REVENUE
                    </div>
                    <div className="text-2xl sm:text-2xl font-bold text-[#000000]">
                      ${totalRevenue}
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#E5E7EB] rounded-xl flex items-center justify-center">
                    <DollarSign className="text-[#1E3A8A]" size={18} />
                  </div>
                </div>
              </div>

              <div className="bg-[#F9FAFB] border border-[#C3D3E2] rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#1E3A8A] mb-1">
                      TOTAL PROFIT
                    </div>
                    <div className="text-2xl sm:text-2xl font-bold text-[#000000]">
                      ${totalProfit}
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#E5E7EB] rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-[#1E3A8A]" size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="h-[300px] bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-white border-b border-[#F0F0F0] px-5 py-3">
                <div
                  className={`grid ${
                    activeTab === "direct" ? "grid-cols-7" : "grid-cols-6"
                  } gap-4 py-2 text-sm font-bold text-[#1E3A8A] uppercase tracking-wider`}
                >
                  <div>Date & Time</div>
                  {activeTab === "direct" && <div>Buyer</div>}
                  <div>Item</div>
                  <div>Price</div>
                  <div>Qty</div>
                  <div>Revenue</div>
                  <div>Profit</div>
                </div>
              </div>

              {/* Scrollable Table Body */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-[#E5E7EB]">
                  {currentData.map((transaction: any, index: any) => {
                    const totalPrice2 = transaction.selectedProducts.reduce(
                      (acc: any, curr: any) =>
                        parseInt(acc) + parseInt(curr.price),
                      0
                    );
                    const totalqty = transaction.selectedProducts.reduce(
                      (acc: any, curr: any) =>
                        parseInt(acc) + parseInt(curr.quantity),
                      0
                    );
                    const { totalQty, totalPrice, totalRevenue } =
                      transaction.selectedProducts.reduce(
                        (acc: any, curr: any) => {
                          const qty = parseInt(curr.quantity);
                          const price = parseFloat(curr.price);
                          acc.totalQty += qty;
                          acc.totalPrice += qty * price;
                          acc.totalRevenue += qty * price; // if revenue = qty × price
                          return acc;
                        },
                        {
                          totalQty: 0,
                          totalPrice: 0,
                          totalRevenue: 0,
                        }
                      );

                    return (
                      <div
                        key={transaction.id}
                        className={`px-5 py-3 grid ${
                          activeTab === "direct" ? "grid-cols-7" : "grid-cols-6"
                        } gap-4 items-center hover:bg-[#F8F9FA] transition-all duration-200 group ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                        }`}
                      >
                        <div className="text-sm text-[#19191D] font-medium">
                          <div>{transaction.currentDate}</div>
                          <div className="text-xs text-[#6B7280]">
                            {transaction.time}
                          </div>
                        </div>
                        {activeTab === "direct" && (
                          <div className="text-sm text-[#19191D] font-medium">
                            {transaction.buyerName || (
                              <span className="text-[#6B7280] italic">
                                No buyer
                              </span>
                            )}
                          </div>
                        )}
                        <div className="text-sm text-[#19191D] font-medium">
                          {transaction.selectedProducts.map((e: any) => {
                            return <p>{e.name}</p>;
                          })}
                        </div>
                        <div className="text-sm text-[#000000] font-bold">
                          <p>{totalPrice2}</p>
                        </div>
                        <div className="text-sm text-[#19191D] font-medium">
                          <span className="bg-[#F9FAFB] border border-[#C3D3E2] px-2 py-1 rounded-full text-xs">
                            {totalqty}
                          </span>
                        </div>
                        <div className="text-sm text-[#1E3A8A] font-bold">
                          ${totalRevenue}
                        </div>
                        <div className="text-sm text-[#1E3A8A] font-bold">
                          ${transaction.estimatedProfit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
