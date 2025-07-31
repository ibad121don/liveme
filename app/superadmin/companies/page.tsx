
"use client";

import { useState, useEffect } from "react";
import DataTableCard from "@/components/ui/DataTableCard";
import CompaniesHeader from "@/components/ui/CompaniesHeader";
import CompanyDetailsModal from "@/components/ui/CompanyDetailsModal";
import EditCompanyModal from "@/components/ui/EditCompanyModal";
import CreateCompanyModal from "@/components/ui/CreateCompanyModal"; 
import InvitationCodeModal from "@/components/ui/InvitationCodeModal";
import DashboardFooter from "@/components/ui/DashboardFooter";


import { useCompanies } from "../../../hooks/companies/useCompanies";
import { useCompanyById } from "../../../hooks/companies/useCompanyById";
import { useUpdateCompanyDetails } from "../../../hooks/companies/useUpdateCompany";
import { useUpdateCompanyStatus } from "../../../hooks/companies/useUpdateCompanyStatus";

import { useQueryClient } from "@tanstack/react-query";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

export interface CompanyRow {
  [key: string]: unknown;
  id: string; 
  name: string;
  email: string;
  lastPurchase?: string; 
  plan: string;
  status: "Active" | "In-Active";
  dropdownActions?: string[];
  phone?: string;
  address?: string;
  website?: string;
  purchaseDate?: string;
  expiryDate?: string;
  subscriptionPlan?: string; 
  isActive?: boolean; 
  password?: string;
  confirmPassword?: string;
}

const companiesColumns = [
  { label: "Company name", key: "name" },
  { label: "Admin Email", key: "email" },
  { label: "Subscription Plan", key: "plan" }, 
  { label: "Renewal Date", key: "expiryDate" },
  { label: "Status", key: "status" }, 
  { label: "Actions", key: "actions" },
];

export default function Companies() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyRow | null>(
    null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitationModalOpen, setInvitationModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;


  const queryClient = useQueryClient();

  const { data: companies, isLoading, error } = useCompanies();
  const {
    data: companyDetails,
    isLoading: isLoadingCompanyDetails,
    error: companyDetailsError,
  } = useCompanyById(selectedCompanyId); 

  const { mutate: updateCompanyDetailsMutation, isPending: isUpdatingDetails } =
    useUpdateCompanyDetails(); 
  const { mutate: updateCompanyStatusMutation, isPending: isUpdatingStatus } =
    useUpdateCompanyStatus(); 

  useEffect(() => {
    console.log(
      "Companies component re-render. selectedCompanyId:",
      selectedCompanyId
    );
    console.log(
      "useCompanyById result - companyDetails:",
      companyDetails,
      "isLoadingCompanyDetails:",
      isLoadingCompanyDetails,
      "companyDetailsError:",
      companyDetailsError
    );
    if (companyDetails) {
    
      const mappedCompanyDetails: CompanyRow = {
        ...companyDetails,
        _id: companyDetails._id || companyDetails.id,
        status: companyDetails.isActive ? "Active" : "In-Active",
        plan: companyDetails.subscriptionPlan || companyDetails.plan,
      };
      console.log("Setting selectedCompany to:", mappedCompanyDetails.name);
      setSelectedCompany(mappedCompanyDetails);
    } else {
      console.log(
        "companyDetails is null or undefined. selectedCompany will remain null."
      );
      setSelectedCompany(null);
    }
  }, [
    selectedCompanyId,
    companyDetails,
    isLoadingCompanyDetails,
    companyDetailsError,
  ]);

  const handleActionClick = async (row: CompanyRow, action: string) => {
    console.log(
      "handleActionClick called with row:",
      row,
      "and action:",
      action
    );

    const companyIdToUse = String(row._id || row._id);
    console.log(
      "handleActionClick: Company ID:",
      companyIdToUse,
      "Action:",
      action
    );
    setSelectedCompanyId(companyIdToUse);

    if (action === "View details") {
      setDetailsOpen(true);
      setEditOpen(false);
    } else if (action === "Edit Company") {
      setEditOpen(true);
      setDetailsOpen(false);
    }
  };

  console.log("Selected Company ID (state):", selectedCompanyId);

  const handleSaveCompany = async (updated: CompanyRow) => {
    const payload = {
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      website: updated.website,
      subscriptionPlan: updated.plan, 
      purchaseDate: updated.purchaseDate,
      expiryDate: updated.expiryDate,
      isActive: updated.status === "Active" ? true : false,
    };

    console.log(
      "handleSaveCompany: Updating company with ID:",
      updated.id,
      "Payload:",
      payload
    );
    updateCompanyDetailsMutation(
      { companyId: updated.id, updatedData: payload },
      {
        onSuccess: () => {
          console.log("Company update successful!");
          setEditOpen(false);
          setSelectedCompanyId(null);
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          queryClient.invalidateQueries({ queryKey: ["company", updated.id] }); 
        },
        onError: (err: any) => {
          console.error(
            "handleSaveCompany: Error saving company:",
            err.message
          );
        },
      }
    );
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Active" | "In-Active"
  ) => {
    console.log(
      "handleStatusChange: Company ID:",
      id,
      "New Status:",
      newStatus
    );
    updateCompanyStatusMutation(
      { companyId: id, newStatus },
      {
        onSuccess: () => {
          console.log("Status update successful!");
          setDetailsOpen(false);
          setSelectedCompanyId(null);
          queryClient.invalidateQueries({ queryKey: ["companies"] });
          queryClient.invalidateQueries({ queryKey: ["company", id] }); 
        },
        onError: (err: any) => {
         
          console.error(
            "handleStatusChange: Error changing status:",
            err.message
          );
        },
      }
    );
  };

  const handleCompanyCreateSuccess = () => {
    console.log(
      "Company creation successful callback in parent (modal closed, invitation opened)!"
    );
    setIsModalOpen(false);
    setInvitationModalOpen(true);
    
  };

  const companyStatusColors = {
    Active: "#19CE71",
    "In-Active": "#F24E1E",
  };

  const effectiveCompanies = companies || [];
  const totalPages = Math.ceil(effectiveCompanies.length / pageSize);
  const paginatedRows = effectiveCompanies.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const handleDownloadList = (format: string) => {
    if (!effectiveCompanies || effectiveCompanies.length === 0) {
      console.warn("No companies to download.");
      return;
    }

    const fileName = `CompaniesList_${new Date().toISOString().split("T")[0]}`;

    if (format === "PDF") {
      const doc = new jsPDF();
      const tableColumn = companiesColumns.map((col) => col.label);
      const tableRows = effectiveCompanies.map((company) => [
        company.name ?? "",
        company.email ?? "",
        company.plan ?? "",
        company.expiryDate ?? "",
        company.status ?? "",
        "View/Edit",
      ]);

      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        headStyles: {
          fillColor: "#1E3A8A",
          textColor: "#FFFFFF",
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        columnStyles: {},
      });
      doc.save(`${fileName}.pdf`);
    } else if (format === "CSV") {
      const csvHeader = companiesColumns
        .map((col) => `"${col.label}"`)
        .join(",");

      const csvRows = effectiveCompanies.map((company) => {
        return companiesColumns
          .map((col) => {
            const value =
              company[col.key] !== undefined && company[col.key] !== null
                ? String(company[col.key])
                : "";

            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",");
      });

      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${fileName}.csv`);
    } else if (format === "Excel") {
      const csvHeader = companiesColumns
        .map((col) => `"${col.label}"`)
        .join(",");
      const csvRows = effectiveCompanies.map((company) => {
        return companiesColumns
          .map((col) => {
            const value =
              company[col.key] !== undefined && company[col.key] !== null
                ? String(company[col.key])
                : "";
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",");
      });

      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${fileName}.xlsx`);
      console.warn(
        "For true Excel (.xlsx) files, consider a dedicated library like 'xlsx-js-style'. This generates a CSV with .xlsx extension."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading companies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 text-lg font-semibold">
        Error loading companies: {error.message}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <CompaniesHeader onAddCompanyClick={() => setIsModalOpen(true)} />

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCompanyCreateSuccess}
      />

      <InvitationCodeModal
        isOpen={invitationModalOpen}
        onClose={() => setInvitationModalOpen(false)}
        link="https://your-invite-link.com/abc123" 
      />

      <DataTableCard<CompanyRow>
        columns={companiesColumns}
        rows={paginatedRows}
        statusColorMap={companyStatusColors}
        enableActions
        onActionClick={handleActionClick}
      />

      <CompanyDetailsModal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedCompanyId(null);
        }}
        company={selectedCompany}
        onStatusChange={handleStatusChange}
        isLoading={isLoadingCompanyDetails || isUpdatingStatus}
      />

      <EditCompanyModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedCompanyId(null);
        }}
        company={selectedCompany}
        onSave={handleSaveCompany}
        isLoading={isLoadingCompanyDetails || isUpdatingDetails}
      />

      <DashboardFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDownload={handleDownloadList}
      />
    </div>
  );
}
