"use client";

import { useEffect, useState } from "react";
import { Pencil, Lock } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import Image from "next/image";
import clsx from "clsx";
import { updateSellerSettings, getSellerSettings } from "@/lib/api";
import { decodeJwt } from "jose";

export default function AccountSettings() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    contactEmail: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("userData");
    const decoded = token ? decodeJwt(token) : null;

    const decodedEmail = decoded?.email ?? "";

    const fetchData = async () => {
      try {
        const { success, data, error } = await getSellerSettings();
        if (success && data) {
          setForm({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: typeof decodedEmail === "string" ? decodedEmail : "",
            password: "",
            companyName: data.companyName ?? "",
            contactEmail: data.contactEmail ?? "",
          });
        } else {
          console.error("Failed to fetch settings:", error);
        }
      } catch (err) {
        console.error("Error fetching seller profile:", err);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const { success, error, data } = await updateSellerSettings(form);
    if (success) {
      console.log("Updated successfully", data);
    } else {
      console.error("Failed to update:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="max-w-6xl h-full mx-auto bg-white rounded-[20px] p-6 sm:p-8">
        {/* Header */}
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
              onClick={async () => {
                if (isEditing) await handleSave();
                setIsEditing(!isEditing);
              }}
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

        {/* Body */}
        <div className="flex flex-col gap-6">
          {/* General Info */}
          <div>
            <h3 className="text-[#05004E] text-md font-semibold mb-4">
              General Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <TextInput
                label="First Name"
                value={form.firstName ?? ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={!isEditing}
              />
              <TextInput
                label="Last Name"
                value={form.lastName ?? ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={!isEditing}
              />
              <TextInput
                label="Email"
                value={form.email ?? ""}
                onChange={() => {}}
                disabled={true}
              />
              <TextInput
                label="Password"
                type="password"
                value={form.password ?? ""}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-[#05004E] text-md font-semibold mb-4">
              Associated Company
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Company Name"
                value={form.companyName ?? ""}
                onChange={(e) => handleChange("companyName", e.target.value)}
                disabled={!isEditing}
              />
              <TextInput
                label="Contact Email"
                value={form.contactEmail ?? ""}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
