// src/components/ui/CreateCompanyModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import Select from "./Select";
// Import the new custom hook
import { useCreateCompany } from "../../hooks/companies/useCreateNewCompany";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCompanyModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCompanyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [plan, setPlan] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const {
    mutate: createCompanyMutation,
    isPending,
    error,
  } = useCreateCompany();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setClientError(null);

    if (password !== confirmPassword) {
      setClientError("Passwords do not match.");
      return;
    }
    if (!name || !email || !plan || !password) {
      setClientError(
        "Please fill in all required fields (Company Name, Email, Plan, Password)."
      );
      return;
    }

    const payload = {
      name,
      email,
      phone,
      address,
      website,
      plan,
      password,
      confirmPassword,
    };

    console.log("Attempting to create company with payload:", payload);

    createCompanyMutation(payload, {
      onSuccess: (data) => {
        console.log(
          "Company creation initiated successfully from modal:",
          data
        );

        onClose();
        onSuccess();
      },
      onError: (err) => {
        console.error("Error creating company in modal:", err.message);
      },
    });
  };

  const displayError = clientError || (error ? error.message : null);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-6 sm:p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          disabled={isPending}
        >
          <X size={16} />
        </button>

        <h2 className="text-[#0B0B58] text-2xl font-bold mb-6 text-center">
          Add New Company
        </h2>

        {displayError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {displayError}</span>
          </div>
        )}

        <p className="text-[#0B0B58] font-semibold mb-2">General Info</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <TextInput
            label="Company Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <TextInput
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
          <TextInput
            label="Phone Num"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
          />
          <TextInput
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isPending}
          />
          <TextInput
            label="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={isPending}
          />
        </div>

        <p className="text-[#0B0B58] font-semibold mb-2">Other Details</p>
        <div className="flex gap-3 items-center mb-6">
          <Select
            label="Select Plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            options={[
              { label: "Plan A", value: "Plan A" },
              { label: "Plan B", value: "Plan B" },
              { label: "Plan C", value: "Plan C" },
            ]}
            disabled={isPending}
          />
          <TextInput
            label="Create Password"
            type="password"
            placeholder="Type here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="Type here"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#1E3A8A] hover:bg-[#162d6c] text-white font-semibold py-3 rounded-lg transition-all"
          disabled={isPending} // Disable button during loading
        >
          {isPending ? "Creating Company..." : "Generate Code"}
        </button>
      </div>
    </div>
  );
}
