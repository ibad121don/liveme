"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardFooter from "@/components/ui/DashboardFooter";
import DataTableCard from "@/components/ui/DataTableCard";
import PayrollHeader from "@/components/ui/PayrollHeader";
import EditHoursModal from "@/components/ui/EditHoursModal";
import { useEmployees } from "@/hooks/admin/employees/useEmployees";

interface PayrollRow {
  id: string;
  employee: string;
  paymentType: string;
  revenue: string;
  profit: string;
  hoursOrCommission: string;
  calculatedPay: string;
  dropdownActions?: string[];
  [key: string]: string | string[] | undefined;
}

const payrollColumns = [
  { label: "Employee Name", key: "employee" },
  { label: "Payment Type", key: "paymentType" },
  { label: "Revenue", key: "revenue" },
  { label: "Profit", key: "profit" },
  { label: "Hrs/Commission", key: "hoursOrCommission" },
  { label: "Calculated Pay", key: "calculatedPay" },
  { label: "Actions", key: "actions" },
];

export default function ManagePayrolls() {
  const { employees, isLoading } = useEmployees();
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<PayrollRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    if (!employees) return;

    console.log("Total employees:", employees.length);
    setTotalEmployees(employees.length);

    const mapped: PayrollRow[] = employees.map((emp, i) => ({
      id: emp._id || `${i}`,
      employee: emp.name,
      paymentType: emp.paymentType,
      revenue: "$0",
      profit: "$0",
      hoursOrCommission:
        emp.paymentType === "Hourly"
          ? `${emp.rate}`
          : emp.paymentType === "Commission"
          ? `${emp.rate}`
          : "—",
      calculatedPay: "$0",
      dropdownActions: emp.paymentType === "Hourly" ? ["Edit Hours"] : [],
    }));
    setRows(mapped);
  }, [employees]);

  const totalPages = Math.ceil(rows.length / pageSize);

  const paginatedRows = useMemo(() => {
    return rows.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize
    );
  }, [rows, currentPage]);

  const handleActionClick = (row: PayrollRow, action: string) => {
    if (action === "Edit Hours") {
      setSelectedRow(row);
      setModalOpen(true);
    }
  };

  const handleHoursUpdate = (newHours: string) => {
    if (!selectedRow) return;

    const updated = rows.map((r) =>
      r.id === selectedRow.id
        ? { ...r, hoursOrCommission: `${newHours}$/hr` }
        : r
    );
    setRows(updated);
    setModalOpen(false);
    setSelectedRow(null);
  };

  if (isLoading) return <div>Loading employees...</div>;

  return (
    <div className="flex flex-col gap-6">
      <PayrollHeader totalEmployees={totalEmployees} />

      <DataTableCard<PayrollRow>
        columns={payrollColumns}
        rows={paginatedRows}
        enableActions
        onActionClick={handleActionClick}
      />

      <EditHoursModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleHoursUpdate}
        initialValue={
          selectedRow?.paymentType === "Hourly"
            ? selectedRow.hoursOrCommission.replace("$/hr", "")
            : ""
        }
      />

      <DashboardFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDownload={(format) => {
          console.log(`Downloading Payroll as ${format}`);
        }}
      />
    </div>
  );
}
