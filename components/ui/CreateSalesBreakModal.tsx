"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getInventoryItems, updateBreakdata } from "@/lib/api";
import { InventoryItem } from "@/lib/userAPITypes";

interface CreateSalesBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

type Product = {
  id: any;
  name: string;
  price: number;
  quantity: number;
  // Add other InventoryItem fields as needed
  selected: boolean;
};

export default function CreateSalesBreakModal({
  isOpen,
  onClose,
  data,
}: CreateSalesBreakModalProps) {
  const [breakName, setBreakName] = useState("");
  const [spotCount, setSpotCount] = useState("");
  const [spotPrice, setSpotPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const items: InventoryItem[] = await getInventoryItems();
      console.log("Fetched inventory items:", items);

      try {
        const items: InventoryItem[] = await getInventoryItems();
        const enrichedItems: Product[] = items.map((item) => ({
          id: item._id,
          name: String(item.name),
          price: item.price,
          quantity: item.currentStock,
          selected: false,
        }));
        setProducts(enrichedItems);
        console.log(enrichedItems);
      } catch (error) {
        console.error("Failed to fetch inventory items:", error);
      }
    };

    if (isOpen) fetchProducts();
  }, [isOpen]);

  const selectedProducts = products.filter((p) => p.selected);
  const totalCost = selectedProducts.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );
  const platformFee = totalCost * 0.1;

  const parsedSpotCount = parseInt(spotCount || "1");
  const parsedSpotPrice = parseFloat(spotPrice || "0");

  const recommendedSpotPrice =
    parsedSpotCount > 0
      ? Math.ceil((totalCost + platformFee) / parsedSpotCount)
      : 0;

  const estimatedProfit = totalCost - recommendedSpotPrice - platformFee;

  const toggleProductSelection = (id: any) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const filteredProducts = products.filter((p) =>
    (p.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <style>{`
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
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>

      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-5xl h-[95vh] rounded-2xl p-6 relative shadow-lg overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-xl sm:text-2xl font-bold mb-6">
            Create Sales Break
          </h2>

          <div className="grid grid-cols-1 xl:grid-cols-3 h-[85%] gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#000000] mb-1">
                    Break Name
                  </label>
                  <input
                    type="text"
                    value={breakName}
                    onChange={(e) => setBreakName(e.target.value)}
                    placeholder="Enter Name"
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#000000] mb-1">
                    No. of spots
                  </label>
                  <input
                    type="number"
                    value={spotCount}
                    onChange={(e) => setSpotCount(e.target.value)}
                    placeholder="Set no. of spots"
                    className="w-full px-3 py-2 border border-[#C3D3E2] bg-[#F9FAFB] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#000000] mb-1">
                    Spot Price
                  </label>
                  <input
                    type="number"
                    value={spotPrice}
                    onChange={(e) => setSpotPrice(e.target.value)}
                    placeholder="Enter Spot Price($)"
                    className="w-full px-3 py-2 border border-[#C3D3E2] text-black bg-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#000000] mb-1">
                  Select Products to add
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product here..."
                  className="w-full mb-4 px-3 py-2 border text-black border-[#C3D3E2] bg-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
                />

                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                  <div className="bg-white border-b border-[#F0F0F0] px-4 py-3 grid grid-cols-4 text-sm font-semibold text-[#1E3A8A] uppercase">
                    <div>SELECT</div>
                    <div>ITEM</div>
                    <div>PRICE</div>
                    <div>QUANTITY</div>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-[#E5E7EB] custom-scrollbar">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-3 grid grid-cols-4 items-center hover:bg-[#F8F9FA] transition-colors"
                      >
                        <div>
                          <input
                            type="checkbox"
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
            </div>

            <div className="flex flex-col justify-between bg-[#F9FAFB] border border-[#C3D3E2] rounded-lg p-4 h-full">
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
                    <span className="text-[#000000]">Total Cost</span>
                    <span className="font-semibold text-[#000000]">
                      ${totalCost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#000000]">Platform Fee (10%)</span>
                    <span className="font-semibold text-[#000000]">
                      ${platformFee.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#000000]">
                      Recommended Spot Price
                    </span>
                    <span className="font-semibold text-[#000000]">
                      ${recommendedSpotPrice}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-3 flex justify-between">
                    <span className="text-[#000000]">Estimated Profit</span>
                    <span className="font-semibold text-[#000000]">
                      ${estimatedProfit}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  console.log({
                    breakName,
                    spotCount: parsedSpotCount,
                    spotPrice: parsedSpotPrice,
                    selectedProducts,
                    totalCost,
                    platformFee,
                    estimatedProfit,
                    id2: data.id,
                    totalProduct: selectedProducts.length,
                    platformFee1: platformFee.toFixed(0),
                    recommendedSpotPrice,
                    currentDate,
                  });
                  updateBreakdata(
                    {
                      breakName,
                      spotCount: parsedSpotCount,
                      spotPrice: parsedSpotPrice,
                      selectedProducts,
                      totalCost,
                      platformFee,
                      estimatedProfit,
                      id2: data.id,
                      platformFee1: platformFee.toFixed(0),
                      recommendedSpotPrice,
                      currentDate,
                    },
                    data.id
                  );
                  onClose();
                }}
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
