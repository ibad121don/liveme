"use client";

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { useQueryClient } from "@tanstack/react-query";

import UsersHeader from "@/components/ui/UsersHeader";
import DataTableCard from "@/components/ui/DataTableCard";
import UserDetailsModal from "@/components/ui/UserDetailsModal";
import EditUserModal from "@/components/ui/EditUserModal";
import ResetPasswordModal from "@/components/ui/ResetPasswordModal";
import DeactivateCompanyConfirmModal from "@/components/ui/DeactivateCompanyConfirmModal";
import AddUserModal from "@/components/ui/AddUserModal";
import SuccessModal from "@/components/ui/SuccessModal";
import DashboardFooter from "@/components/ui/DashboardFooter";

import { useUsers } from "../../../hooks/users/useUsers";
import { useUserById } from "../../../hooks/users/useUserById";
import { useAddUser } from "../../../hooks/users/useAddUser";
import { useUpdateUser } from "../../../hooks/users/useUpdateUser";
import { useUpdateUserStatus } from "../../../hooks/users/useUpdateUserStatus";

import {
  UserRow,
  ApiUser,
  AddUserPayload,
  UpdateUserPayload,
} from "../../../lib/userAPITypes";

const usersColumns: { label: string; key: keyof UserRow }[] = [
  { label: "Name", key: "name" },
  { label: "Company Name", key: "company" },
  { label: "Role", key: "role" },
  { label: "Email", key: "email" },
  { label: "Joined On", key: "joinedOn" },
  { label: "Status", key: "status" },
  { label: "Last Login", key: "lastLogin" },
  { label: "Actions", key: "actions" },
];

const userStatusColors: Record<string, string> = {
  Active: "#19CE71",
  "In-Active": "#F24E1E",
};

export default function Users() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 15;
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserForModal, setSelectedUserForModal] =
    useState<UserRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({ page: currentPage + 1, size: pageSize, q: searchQuery });

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useUserById(selectedUserId);
  const { mutate: addUserMutation, isPending: isAddingUser } = useAddUser();
  const { mutate: updateUserMutation, isPending: isUpdatingUser } =
    useUpdateUser();
  const { mutate: updateUserStatusMutation, isPending: isUpdatingUserStatus } =
    useUpdateUserStatus();

  useEffect(() => {
    if (userDetails) {
      const mappedUser: UserRow = {
        id: userDetails._id,
        name: userDetails.name,
        company:
          typeof userDetails.company === "object" &&
          userDetails.company !== null
            ? userDetails.company.name || "N/A"
            : typeof userDetails.company === "string"
            ? userDetails.company
            : "N/A",
        role: userDetails.role,
        email: userDetails.email,
        joinedOn: userDetails.joinedOn,
        status: userDetails.isActive ? "Active" : "In-Active",
        lastLogin: userDetails.lastLogin,
        phone: userDetails.phone,
        address: userDetails.address,
        website: userDetails.website,
        plan: userDetails.subscriptionPlan,
        purchaseDate: userDetails.purchaseDate,
        expiryDate: userDetails.expiryDate,
      };
      setSelectedUserForModal(mappedUser);
    } else {
      setSelectedUserForModal(null);
    }
  }, [userDetails]);

  const mappedUsers: UserRow[] =
    usersData?.users?.map((user: ApiUser) => ({
      id: user._id,
      name: user.name,
      company: user.company?.name || "N/A",
      role: user.role,
      email: user.email,
      joinedOn: user.joinedOn,
      status: user.isActive ? "Active" : "In-Active",
      lastLogin: user.lastLogin,
      phone: user.phone,
      address: user.address,
      website: user.website,
      plan: user.subscriptionPlan,
      purchaseDate: user.purchaseDate,
      expiryDate: user.expiryDate,
      dropdownActions: [
        "View details",
        "Edit Details",
        "Reset Password",
        "Deactivate",
      ],
    })) || [];

  const totalPages = Math.ceil((usersData?.total || 0) / pageSize);

  const handleActionClick = (row: UserRow, action: string) => {
    setSelectedUserId(row.id);
    setDetailsOpen(action === "View details");
    setEditOpen(action === "Edit Details");
    setResetOpen(action === "Reset Password");
    setConfirmDeactivateOpen(action === "Deactivate");
  };

  const handleStatusChange = (
    id: string,
    newStatus: "Active" | "In-Active"
  ) => {
    updateUserStatusMutation(
      { userId: id, newStatus },
      {
        onSuccess: () => {
          setDetailsOpen(false);
          setSuccessMessage(
            `User successfully ${
              newStatus === "Active" ? "activated" : "deactivated"
            }!`
          );
          setSuccessModalOpen(true);
          setSelectedUserId(null);
        },
        onError: (err: any) => {
          console.error("Error changing user status:", err.message);
        },
      }
    );
  };

  const handleSaveUser = (updated: UpdateUserPayload & { userId: string }) => {
    updateUserMutation(
      { userId: updated.userId, updatedData: updated },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSuccessMessage("User details updated successfully!");
          setSuccessModalOpen(true);
          setSelectedUserId(null);
        },
        onError: (error: any) => {
          console.error("Error saving user:", error.message);
          alert(`Failed to save user: ${error.message || "Unknown error"}`);
        },
      }
    );
  };

  const handleConfirmDeactivate = () => {
    if (selectedUserForModal) {
      handleStatusChange(selectedUserForModal.id, "In-Active");
      setConfirmDeactivateOpen(false);
    }
  };

  const handleAddUser = (newUser: AddUserPayload) => {
    addUserMutation(newUser, {
      onSuccess: () => {
        setAddUserOpen(false);
        setSuccessMessage("New user added successfully!");
        setSuccessModalOpen(true);
      },
      onError: (error: any) => {
        console.error("Error adding user:", error.message);
        alert(`Failed to add user: ${error.message || "Unknown error"}`);
      },
    });
  };

  const handleDownloadList = async (format: string) => {
    if (mappedUsers.length === 0) {
      alert("No users to export.");
      return;
    }

    const fileName = `UsersList_${new Date().toISOString().split("T")[0]}`;

    if (format === "PDF") {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const margin = 10;
      let y = 20;

      const colWidths: { [key: string]: number } = {
        name: 30,
        company: 30,
        role: 25,
        email: 40,
        joinedOn: 25,
        status: 20,
        lastLogin: 40,
        actions: 20,
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255);
      doc.setFillColor("#1E3A8A");

      let x = margin;
      usersColumns.forEach((col) => {
        const w = colWidths[col.key] || 25;
        doc.rect(x, y, w, 10, "F");
        doc.text(col.label, x + 2, y + 7);
        x += w;
      });
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(0);

      mappedUsers.forEach((user) => {
        x = margin;
        usersColumns.forEach((col) => {
          const w = colWidths[col.key] || 25;
          let val = user[col.key as keyof UserRow] ?? "";
          if (col.key === "actions") val = "View/Edit";
          doc.text(String(val), x + 2, y + 6);
          x += w;
        });
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save(`${fileName}.pdf`);
    } else {
      const csvHeader = usersColumns.map((c) => `"${c.label}"`).join(",");
      const csvRows = mappedUsers.map((user) =>
        usersColumns
          .map((col) => {
            let val = user[col.key as keyof UserRow] ?? "";
            if (col.key === "actions") return `"View/Edit"`;
            return `"${val.toString().replace(/"/g, '""')}"`;
          })
          .join(",")
      );

      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const ext = format === "Excel" ? "xlsx" : "csv";
      saveAs(blob, `${fileName}.${ext}`);
    }
  };

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-700">
        Loading users...
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 text-lg">
        Error loading users: {usersError.message}
        <button
          onClick={() => refetchUsers()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader
        onAddUserClick={() => setAddUserOpen(true)}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage(0);
        }}
      />

      <DataTableCard<UserRow>
        columns={usersColumns}
        rows={mappedUsers}
        statusColorMap={userStatusColors}
        enableActions
        onActionClick={handleActionClick}
        isLoading={
          isLoadingUsers ||
          isAddingUser ||
          isUpdatingUser ||
          isUpdatingUserStatus
        }
      />

      <UserDetailsModal
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedUserId(null);
        }}
        user={selectedUserForModal}
        onStatusChange={handleStatusChange}
        isLoading={isLoadingUserDetails || isUpdatingUserStatus}
      />

      <EditUserModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedUserId(null);
        }}
        user={selectedUserForModal}
        onSave={handleSaveUser}
        isLoading={isLoadingUserDetails || isUpdatingUser}
      />

      <ResetPasswordModal
        isOpen={resetOpen}
        onClose={() => {
          setResetOpen(false);
          setSelectedUserId(null);
        }}
        user={selectedUserForModal}
        onSave={handleSaveUser}
      />

      <DeactivateCompanyConfirmModal
        isOpen={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
        onConfirm={handleConfirmDeactivate}
      />

      <AddUserModal
        isOpen={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onAdd={handleAddUser}
        isLoading={isAddingUser}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message={successMessage}
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
