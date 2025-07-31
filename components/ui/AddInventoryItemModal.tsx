"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import Select from "@/components/ui/SelectDropdown";
import SuccessModal from "./SuccessModal";

// ✅ Strongly typed inventory item interface
interface InventoryItem {
  name: string;
  manufacturer: string;
  year: number;
  price: number;
  //quantity: number;       // optional if not sent to backend
  currentStock: number; // required by backend schema
  sportCategory: string;
  status: "In stock" | "Out of stock";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: InventoryItem) => void;
}

export default function AddInventoryItemModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [itemName, setItemName] = useState("");
  const [sportCategory, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [mfgYear, setMfgYear] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!itemName) newErrors.itemName = "Required";
    if (!sportCategory) newErrors.category = "Required";
    if (!manufacturer) newErrors.manufacturer = "Required";
    if (!mfgYear) newErrors.mfgYear = "Required";
    if (!price || isNaN(+price)) newErrors.price = "Enter valid number";
    if (!quantity || isNaN(+quantity))
      newErrors.quantity = "Enter valid number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setItemName("");
    setCategory("");
    setManufacturer("");
    setMfgYear("");
    setPrice("");
    setQuantity("");
    setErrors({});
  };
  const handleAdd = () => {
    if (!validate()) return;

    const newItem: InventoryItem = {
      name: itemName,
      sportCategory,
      manufacturer,
      year: Number(mfgYear), // fix: convert year to number
      price: Number(price), // fix: ensure number
      //quantity: Number(quantity), // optional, for local use
      currentStock: Number(quantity), // fix: this is what your DB expects
      status: Number(quantity) > 0 ? "In stock" : "Out of stock",
    };

    onSuccess(newItem);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      resetForm();
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-2xl font-bold mb-6 text-left">
            Add a new item
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col space-y-1">
              <TextInput
                label="Item Name"
                placeholder="Enter name here"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                error={errors.itemName}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Select
                label="Category"
                selected={sportCategory}
                onChange={setCategory}
                options={["Football", "Basketball", "Baseball"]}
                placeholder="Select here"
              />
              {errors.category && (
                <p className="text-red-500 text-sm px-1">{errors.category}</p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <Select
                label="Manufacturer"
                selected={manufacturer}
                onChange={setManufacturer}
                options={["Tops", "Panini", "Fanatics"]}
                placeholder="Select here"
              />
              {errors.manufacturer && (
                <p className="text-red-500 text-sm px-1">
                  {errors.manufacturer}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1">
              <TextInput
                label="Mfg Year"
                placeholder="Enter manufacturing year"
                value={mfgYear}
                onChange={(e) => setMfgYear(e.target.value)}
                error={errors.mfgYear}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <TextInput
                label="Price"
                placeholder="Set a price($)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <TextInput
                label="Stock Available"
                placeholder="Enter Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={errors.quantity}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAdd}
              className="bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold px-10 py-2 rounded-xl transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Item added successfully!"
      />
    </>
  );
}
