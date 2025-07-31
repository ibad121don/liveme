"use client";

import { useState } from "react";
import { Pencil, Lock } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import SingleRangeSlider from "@/components/ui/SingleRangeSlider";
import DataTableCard from "@/components/ui/DataTableCard";
import AddEmployeeModal from "@/components/ui/AddEmployeeModal";
import EditEmployeeModal, { Employee } from "@/components/ui/EditEmployeeModal";
import DeleteEmployeeModal from "@/components/ui/DeleteEmployeeModal";
import SuccessModal from "@/components/ui/SuccessModal";
import Image from "next/image";
import clsx from "clsx";

import { useEmployees } from "@/hooks/admin/employees/useEmployees";
import { EmployeeRow as ApiEmployeeRow } from "@/types/employee";

const employeeColumns = [
  { label: "EMPLOYEE NAME", key: "name" },
  { label: "PAYMENT TYPE", key: "paymentType" },
  { label: "ROLE", key: "role" },
  { label: "RATE", key: "rate" },
  { label: "STATUS", key: "status" },
  { label: "Actions", key: "actions" },
];

const statusColorMap = {
  Active: "#19CE71",
  Inactive: "#F24E1E",
};

export default function AccountSettings() {
  const {
    employees,
    isLoading,
    isError,
    addEmployee,
    editEmployee,
    deleteEmployee,
  } = useEmployees();

  const [form, setForm] = useState({
    companyName: "AR Groups",
    email: "musfiq123@gmail.com",
    phone: "+9123456876",
    password: "password",
    website: "www.argroupsltd.com",
    address: "House 15, St 3, Sector A, City ABC",
    tiktokFee: "10.0%",
    instagramFee: "10.0%",
    whatnotFee: "10.0%",
  });

  const [selectedRow, setSelectedRow] = useState<
    (ApiEmployeeRow & { dropdownActions?: string[] }) | null
  >(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleActionClick = (
    row: ApiEmployeeRow & { dropdownActions?: string[] },
    action: string
  ) => {
    setSelectedRow(row);
    if (action === "Edit Employee") {
      setEditModalOpen(true);
    } else if (action === "Remove Employee") {
      setDeleteModalOpen(true);
    }
  };

  const handleAddEmployee = (emp: Omit<ApiEmployeeRow, "_id">) => {
    addEmployee({
      ...emp,
      status: emp.status || "Active",
    });
    setAddModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleEditEmployee = (updated: Employee) => {
    if (!updated.id) return;
    editEmployee({
      id: updated.id,
      data: {
        name: updated.name,
        paymentType: updated.paymentType as ApiEmployeeRow["paymentType"],
        role: updated.role as ApiEmployeeRow["role"],
        rate: updated.rate,
        status: updated.status as ApiEmployeeRow["status"],
      },
    });
    setEditModalOpen(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting employee:", selectedRow); // 🔍 Debug log
    if (!selectedRow?._id) return;
    deleteEmployee(selectedRow._id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mappedEmployees = employees.map((emp) => ({
    id: emp._id,
    _id: emp._id,
    name: emp.name,
    paymentType: emp.paymentType,
    role: emp.role,
    rate: emp.rate,
    status: emp.status,
    dropdownActions: ["Edit Employee", "Remove Employee"],
  }));

  if (isLoading) return <p className="p-8">Loading employees...</p>;
  if (isError)
    return <p className="p-8 text-red-500">Failed to load employees.</p>;

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-6xl mx-auto bg-white rounded-[20px] shadow-lg p-6 sm:p-8">
        <div className="flex flex-wrap justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 relative border border-[#E6EAF0] rounded-full overflow-hidden">
              <Image
                src="/assets/profile.jpg"
                alt="Profile"
                fill
                sizes="80px"
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-[#05004E] text-2xl font-bold mb-1">
                Account Settings
              </h2>
              <p className="text-sm text-[#737791]">Account Level: Seller</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-full transition",
                isEditing
                  ? "bg-[#05004E] text-white hover:bg-[#1F2A5C]"
                  : "bg-white text-[#05004E] border border-[#E5EAF4] hover:bg-[#F0F4FF]"
              )}
            >
              <Pencil size={16} />
              {isEditing ? "Save Profile" : "Edit profile"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#05004E] bg-white border border-[#E5EAF4] rounded-full hover:bg-[#F0F4FF] transition">
              <Lock size={16} />
              Reset Password
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <TextInput
            label="Company Name"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            disabled={!isEditing}
          />
          <TextInput
            label="Phone Num"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!isEditing}
          />
          <TextInput
            label="Website"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
            disabled={!isEditing}
          />
          <TextInput
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!isEditing}
          />
          <TextInput
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={!isEditing}
          />
          <TextInput
            label="Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <h3 className="text-[#05004E] text-md font-semibold mb-4">
          Platform Fee
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SingleRangeSlider
            label="Tiktok"
            initialValue={parseFloat(form.tiktokFee)}
            onChange={(val) => handleChange("tiktokFee", `${val.toFixed(1)}%`)}
          />
          <SingleRangeSlider
            label="Instagram"
            initialValue={parseFloat(form.instagramFee)}
            onChange={(val) =>
              handleChange("instagramFee", `${val.toFixed(1)}%`)
            }
          />
          <SingleRangeSlider
            label="Whatnot"
            initialValue={parseFloat(form.whatnotFee)}
            onChange={(val) => handleChange("whatnotFee", `${val.toFixed(1)}%`)}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#05004E] text-md font-semibold">
            Manage Employees
          </h3>
          <button
            onClick={() => setAddModalOpen(true)}
            className="text-sm px-4 py-1 bg-[#1E3A8A] text-white rounded-full hover:bg-[#162d6c]"
          >
            + Add Employee
          </button>
        </div>

        <DataTableCard
          columns={employeeColumns}
          rows={mappedEmployees}
          statusColorMap={statusColorMap}
          enableActions
          onActionClick={handleActionClick}
        />
      </div>

      <AddEmployeeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddEmployee}
      />
      <EditEmployeeModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={selectedRow}
        onSuccess={handleEditEmployee}
      />
      <DeleteEmployeeModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Action completed successfully!"
      />
    </div>
  );
}
