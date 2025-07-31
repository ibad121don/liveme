"use client";

import { useState } from "react";
import DashboardFooter from "@/components/ui/DashboardFooter";
import DataTableCard from "@/components/ui/DataTableCard";
import AdminInventoryHeader from "@/components/ui/AdminInventoryHeader";
import EditInventoryItemModal from "@/components/ui/EditInventoryItemModal";
import DeleteInventoryItemModal from "@/components/ui/DeleteInventoryItemModal";
import AddInventoryItemModal from "@/components/ui/AddInventoryItemModal";
import SuccessModal from "@/components/ui/SuccessModal";

import { useInventory } from "@/hooks/admin/Inventory/useInventory";

// ==== Interfaces ====
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

// ==== Table Config ====
const inventoryColumns = [
  { label: "Item", key: "name" },
  { label: "Sport Category", key: "sportCategory" },
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Year", key: "year" },
  { label: "Price", key: "price" },
  { label: "Quantity", key: "currentStock" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const inventoryStatusColors = {
  "In stock": "#19CE71",
  "Out of stock": "#F24E1E",
};

// ==== Main Page ====
export default function InventoryPage() {
  const {
    data = [],
    isLoading,
    isError,
    error,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory();

  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 15;
  const inventoryRows: InventoryRow[] = data.map((item: any) => ({
    ...item,
    id: item._id,
    dropdownActions: ["Edit Item", "Delete Item"],
  }));

  const totalPages = Math.ceil(inventoryRows.length / pageSize);
  const paginatedRows = inventoryRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleActionClick = (row: InventoryRow, action: string) => {
    setSelectedRow(row);
    if (action === "Edit Item") setEditModalOpen(true);
    if (action === "Delete Item") setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow) return;
    await deleteItem.mutateAsync(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 1500);
  };

  const handleAddItem = async (item: InventoryItem) => {
    await addItem.mutateAsync(item);
    setAddModalOpen(false);
  };

  const handleUpdateItem = async (updatedItem: InventoryRow) => {
    await updateItem.mutateAsync({ id: updatedItem.id, item: updatedItem });
    setEditModalOpen(false);
  };

  const calculateTotalValue = () => {
    return inventoryRows.reduce((total, item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const quantity =
        typeof item.currentStock === "string"
          ? parseInt(item.currentStock, 10)
          : item.currentStock;

      return total + price * quantity;
    }, 0);
  };

  if (isLoading) return <div>Loading inventory...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="flex flex-col gap-6">
      <AdminInventoryHeader onAddItem={() => setAddModalOpen(true)} />

      <DataTableCard<InventoryRow>
        columns={inventoryColumns}
        rows={paginatedRows}
        statusColorMap={inventoryStatusColors}
        enableActions
        onActionClick={handleActionClick}
        total={
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] shadow-inner rounded-xl p-4 text-center">
            <h3 className="text-sm text-[#05004E] mb-1 font-semibold">
              Total Inventory Value
            </h3>
            <p className="text-2xl font-bold text-green-600">
              $
              {calculateTotalValue().toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        }
      />

      <EditInventoryItemModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedRow}
        onSuccess={handleUpdateItem}
      />

      <DeleteInventoryItemModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <AddInventoryItemModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddItem}
      />

      <SuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        message="Item deleted successfully!"
      />

      <DashboardFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDownload={(format) => {
          console.log(`Downloading Inventory as ${format}`);
        }}
      />
    </div>
  );
}
