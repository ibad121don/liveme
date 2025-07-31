
"use client";

import { X, Search, Download, RefreshCw, Copy, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

interface InviteCode {
  id: string;
  code: string;
  company: string;
  dateGenerated: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'used';
  usageCount: number;
}

interface InviteCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dummyData: InviteCode[] = [
  {
    id: "1",
    code: "Jk6917389893",
    company: "Coolbros",
    dateGenerated: "18/6/21",
    expiryDate: "08/2/24",
    status: "expired",
    usageCount: 5,
  },
  {
    id: "2",
    code: "indjef9490948",
    company: "Shelby.inc",
    dateGenerated: "1/5/22",
    expiryDate: "01/01/26",
    status: "active",
    usageCount: 12,
  },
  {
    id: "3",
    code: "jkdjclk0432809",
    company: "Jhon jones",
    dateGenerated: "09/03/25",
    expiryDate: "01/09/26",
    status: "active",
    usageCount: 3,
  },
  {
    id: "4",
    code: "xyz789012345",
    company: "TechCorp",
    dateGenerated: "15/11/24",
    expiryDate: "15/11/25",
    status: "used",
    usageCount: 1,
  },
  {
    id: "5",
    code: "abc123456789",
    company: "StartupInc",
    dateGenerated: "01/12/24",
    expiryDate: "01/12/25",
    status: "active",
    usageCount: 0,
  },
];

export default function InviteCodesModal({ isOpen, onClose }: InviteCodesModalProps) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateGenerated");

  if (!isOpen) return null;

  const filteredData = dummyData.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'used':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-lg relative shadow-xl overflow-hidden border border-gray-200 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg z-10"
        >
          <X size={16} />
        </button>

        {/* Header Section */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex flex-col space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-gray-900 text-xl font-semibold mb-1">Invite Codes</h2>
              <p className="text-gray-600 text-sm">Manage and monitor your invitation codes</p>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search codes or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="used">Used</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="dateGenerated">Date Generated</option>
                    <option value="expiryDate">Expiry Date</option>
                    <option value="company">Company</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button className="bg-[#1E3A8A] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1E3A8A]/95 transition-all duration-200 flex items-center gap-2">
                    <Download size={14} />
                    Export
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            {/* Mobile Cards View */}
            <div className="block lg:hidden p-4 space-y-3">
              {filteredData.map((row) => (
                <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-gray-900 font-medium bg-gray-50 px-2 py-1 rounded text-sm">
                          {row.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(row.code)}
                          className="text-[#1E3A8A] hover:text-[#1E3A8A]/95 transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      <p className="text-gray-900 font-medium text-sm mb-1">{row.company}</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Generated: {row.dateGenerated}</p>
                        <p>Expires: {row.expiryDate}</p>
                        <p>Usage: {row.usageCount}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                      <div className="flex gap-1">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                          <Eye size={14} />
                        </button>
                        <button className="text-red-500 hover:text-red-600 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Invite Code
                    </th>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Company
                    </th>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="py-3 px-4 text-gray-700 font-medium text-xs uppercase tracking-wider">
                      Status
                    </th>
                  
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-900 font-medium bg-gray-50 px-2 py-1 rounded text-sm">
                            {row.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(row.code)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{row.company}</td>
                      <td className="py-3 px-4 text-gray-600">{row.dateGenerated}</td>
                      <td className="py-3 px-4 text-gray-600">{row.expiryDate}</td>
                      <td className="py-3 px-4 text-gray-600">{row.usageCount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
            <p className="text-sm text-gray-600">
              Showing {filteredData.length} of {dummyData.length} invite codes
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-white transition-colors duration-200">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-[#1E3A8A] text-white rounded-md hover:bg-[#1E3A8A]/95 transition-colors duration-200">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-white transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
