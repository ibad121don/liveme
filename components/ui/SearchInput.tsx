import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="flex items-center w-full bg-[#F9FAFB] border border-[#C3D3E2] rounded-xl px-3 py-2">
      <Search className="text-[#1E3A8A] w-4 h-4 mr-2" />
      <input
        type="text"
        placeholder="Search here..."
        className="w-full bg-transparent text-sm text-[#6B7280] placeholder-[#6B7280] outline-none"
      />
    </div>
  );
}
