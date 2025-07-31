"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, Search } from "lucide-react";
import { getInventoryItems } from "@/lib/api";

interface BreakCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  name: string;
  price: number;
  quantity: number;
}

export default function BreakCalculatorModal({
  isOpen,
  onClose,
}: BreakCalculatorModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [noOfSpots, setNoOfSpots] = useState("");
  const [costPerSpot, setCostPerSpot] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handleIncrement = (index: number) => {
    const updated = [...quantities];
    updated[index]++;
    setQuantities(updated);
  };

  const handleDecrement = (index: number) => {
    const updated = [...quantities];
    if (updated[index] > 0) updated[index]--;
    setQuantities(updated);
  };

  const handleCalculate = () => {
    const totalProductCost = products.reduce((sum, product, i) => {
      return sum + product.price * quantities[i];
    }, 0);

    const margin = parseFloat(profitMargin) || 0;
    const spots = parseFloat(noOfSpots) || 1;

    if (spots === 0) {
      setCalculatedPrice(0);
      return;
    }

    const withProfit = totalProductCost * (1 + margin / 100);
    const recommended = withProfit / spots;
    setCalculatedPrice(recommended);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const items = await getInventoryItems();
        const formatted = items.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.stock || item.quantity || 0,
        }));

        setProducts(formatted);
        setQuantities(formatted.map(() => 0));
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

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
        <div className="bg-white w-full max-w-5xl h-[95vh] rounded-xl sm:rounded-2xl p-3 sm:p-6 relative shadow-lg overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center z-10"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pr-10">
            Break Calculator
          </h2>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-auto lg:h-[85%]">
            {/* LEFT SIDE */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block font-semibold text-black mb-1 text-sm">
                    No. of spots
                  </label>
                  <input
                    type="text"
                    placeholder="Enter no."
                    value={noOfSpots}
                    onChange={(e) => setNoOfSpots(e.target.value)}
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#000000] text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-black mb-1 text-sm">
                    Cost per spot
                  </label>
                  <input
                    type="text"
                    placeholder="Enter price($)"
                    value={costPerSpot}
                    onChange={(e) => setCostPerSpot(e.target.value)}
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#000000] text-sm"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block font-semibold text-black mb-1 text-sm">
                    Profit Margin
                  </label>
                  <input
                    type="text"
                    placeholder="e.g 20%"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#000000] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block font-semibold text-black mb-1 text-sm">
                    Streaming Platform
                  </label>
                  <select className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#000000] text-sm">
                    <option>Select here</option>
                    <option>Twitch</option>
                    <option>YouTube</option>
                    <option>Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-black mb-1 text-sm">
                    Select Products to add
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search product here..."
                      className="w-full pl-10 pr-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#000000] text-sm"
                    />
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                    />
                  </div>
                </div>
              </div>

              {/* Product Table */}
              <div className="hidden md:block border border-[#E5E7EB] rounded-lg overflow-hidden">
                <div className="bg-white border-b border-[#F0F0F0] px-4 py-3 grid grid-cols-4 text-sm font-semibold text-[#1E3A8A] uppercase">
                  <div>SELECT (QTY)</div>
                  <div>ITEM</div>
                  <div>PRICE</div>
                  <div>QUANTITY</div>
                </div>
                <div className="max-h-54 overflow-y-auto divide-y divide-[#E5E7EB] custom-scrollbar">
                  {products.map((item, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 grid grid-cols-4 items-center hover:bg-[#F8F9FA] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center hover:bg-[#172D6E] transition-colors"
                          onClick={() => handleDecrement(i)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-black">
                          {quantities[i]}
                        </span>
                        <button
                          className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center hover:bg-[#172D6E] transition-colors"
                          onClick={() => handleIncrement(i)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-sm text-black">{item.name}</div>
                      <div className="text-sm text-black">${item.price}</div>
                      <div className="text-sm text-black">{item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-60 flex flex-col gap-4 mt-4 lg:mt-0">
              <div className="border border-[#C3D3E2] h-auto lg:h-full bg-[#F9FAFB] rounded-xl p-4 sm:p-5">
                <p className="text-[#D08E10] text-sm mb-4">
                  *Select all the values from the left and press the
                  &quot;Calculate&quot; button
                </p>
                <h4 className="text-[#1E3A8A] font-semibold text-base mb-3">
                  Calculated Results:
                </h4>
                {calculatedPrice !== null && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-black">
                      Recommended Price:
                    </span>
                    <span className="font-bold text-lg text-[#1E3A8A]">
                      ${calculatedPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                <p className="text-xs text-[#1E3A8A] leading-relaxed mt-2">
                  *This price includes all costs, fees, and your profit margin
                </p>
              </div>

              <button
                className="w-full bg-[#1E3A8A] text-white font-semibold py-3 rounded-lg hover:bg-[#172D6E] transition"
                onClick={handleCalculate}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
