"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import SuccessModal from "./SuccessModal";
import { UserRow } from "@/app/superadmin/user-management/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  onSave: (updatedUser: UserRow) => void;
}

export default function ResetPasswordModal({ isOpen, onClose, user, onSave }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (password === confirmPassword && password.length > 0 && user) {
      const updatedUser: UserRow = {
        ...user,
        password,
      };
      onSave(updatedUser);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } else {
      alert("Passwords do not match or are empty.");
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-[#FF3B30] hover:bg-red-600 w-7 h-7 rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>

          <h2 className="text-[#0B0B58] text-lg font-bold mb-6">Reset Password</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <TextInput
              label="Create Password"
              placeholder="Type here"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword((prev) => !prev)}
            />
            <TextInput
              label="Confirm Password"
              placeholder="Type Here"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="bg-[#1E3A8A] text-white font-semibold px-6 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Password updated successfully!"
      />
    </>
  );
}
