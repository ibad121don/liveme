"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { getInventoryItems, updateBreakdata } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
}

interface CreateDirectSaleModalProps {
  isOpen: boolean;
  data: any;
  onClose: () => void;
}

export default function CreateDirectSaleModal({
  isOpen,
  onClose,
  data,
}: CreateDirectSaleModalProps) {
  const [buyerName, setBuyerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      try {
        const data = await getInventoryItems();
        const mapped = data.map((item: any) => ({
          id: String(item._id),
          name: item.name,
          price: item.price || 0,
          selected: false,
          quantity: item.currentStock || 0,
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Failed to fetch inventory items", err);
      }
    };

    fetchProducts();
  }, [isOpen]);

  const selectedProducts = products.filter((p) => p.selected);
  const subtotal = selectedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const platformFee = subtotal * 0.1;
  const estimatedProfit = subtotal - platformFee;

  const toggleProductSelection = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(id) ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBreak = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    updateBreakdata(
      {
        buyerName,
        selectedProducts,
        subtotal,
        platformFee,
        estimatedProfit,
        id2: data.id,
        platformFee1: platformFee.toFixed(0),
        type: "direact",
        currentDate,
      },
      data.id
    );
    setBuyerName("");
    setSearchQuery("");
    setProducts((prev) => prev.map((p) => ({ ...p, selected: false })));
    onClose();
  };

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

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-4xl h-[95vh] rounded-2xl p-6 relative shadow-lg overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-xl sm:text-2xl font-bold mb-6">
            Create Direct Sale
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 md:w-1/2">
                  <label className="block font-semibold text-[#000000] mb-1">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  />
                </div>

                <div className="flex-2 md:w-1/2">
                  <label className="block font-semibold text-[#000000] mb-1">
                    Select Products to add
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search product here..."
                      className="w-full pl-10 pr-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <div className="bg-white border-b border-[#F0F0F0] px-4 py-3 grid grid-cols-4 text-sm font-semibold text-[#1E3A8A] uppercase">
                  <div>SELECT</div>
                  <div>ITEM</div>
                  <div>PRICE</div>
                  <div>QUANTITY</div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB] custom-scrollbar">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => toggleProductSelection(product.id)}
                      className="px-4 py-3 grid grid-cols-4 items-center hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                    >
                      <div>
                        <input
                          type="checkbox"
                          onClick={(e) => e.stopPropagation()}
                          checked={product.selected}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 text-[#1E3A8A] bg-gray-100 border-gray-300 rounded focus:ring-[#1E3A8A] focus:ring-2"
                        />
                      </div>
                      <div className="text-sm text-[#19191D]">
                        {product.name}
                      </div>
                      <div className="text-sm text-[#19191D]">
                        ${product.price}
                      </div>
                      <div className="text-sm text-[#19191D]">
                        {product.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full justify-between bg-[#F9FAFB] border border-[#C3D3E2] rounded-lg p-4">
              <div>
                <h3 className="text-[#1E3A8A] font-semibold text-lg mb-4">
                  Break Sale Summary
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#000000]">Products Selected</span>
                    <span className="font-semibold text-[#000000]">
                      {selectedProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#000000]">Subtotal</span>
                    <span className="font-semibold text-[#000000]">
                      ${subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#000000]">Platform Fee(10%)</span>
                    <span className="font-semibold text-[#000000]">
                      ${platformFee.toFixed(0)}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-3 flex justify-between">
                    <span className="text-[#000000]">Estimated Profit</span>
                    <span className="font-semibold text-[#000000]">
                      ${estimatedProfit.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateBreak}
                className="w-full bg-[#1E3A8A] text-white font-semibold py-3 rounded-lg hover:bg-[#172D6E] transition mt-6"
              >
                Create Break
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
