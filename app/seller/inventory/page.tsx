"use client";

import SellerInventoryHeader from "@/components/ui/SellerInventoryHeader";
import DataTableCard from "@/components/ui/DataTableCard";
import SellerFooter from "@/components/ui/SellerFooter";
import { useState } from "react";
import { useInventory } from "@/hooks/dashboard/useInventory";

const inventoryColumns = [
  { label: "Item", key: "item" },
  { label: "Sport Category", key: "sportCategory" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Year", key: "year" },
  { label: "Price", key: "price" },
  { label: "Quantity", key: "quantity" },
  { label: "Status", key: "status" },
];

const inventoryStatusColors = {
  "In stock": "#19CE71",
  "Out of stock": "#F24E1E",
};

export default function Inventory() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  const {
    data: rawData = [],
    isLoading,
    error,
  } = useInventory(undefined, undefined);

  // Map API data to match table column keys
  const inventoryRows = rawData.map((item: any) => ({
    item: item.name || "-",
    sportCategory: item.sportCategory || "-",
    manufacturer: item.manufacturer || "-",
    year: item.year || "-",
    price: item.price ? `$${item.price}` : "-",
    quantity: item.currentStock || "-",
    status: item.status || "-",
  }));

  const totalPages = Math.ceil(inventoryRows.length / pageSize);
  const paginatedRows = inventoryRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center text-gray-500 h-64 text-lg">
        Loading inventory...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center text-red-500 h-64 text-lg">
        Error loading inventory: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <SellerInventoryHeader />
      <DataTableCard
        columns={inventoryColumns}
        rows={paginatedRows}
        statusColorMap={inventoryStatusColors}
        striped
      />
      <SellerFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
