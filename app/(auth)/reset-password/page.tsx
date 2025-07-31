"use client";

import { useState } from "react";
import AuthContainer from "@/components/ui/AuthContainer";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import AuthHeader from "@/components/ui/AuthHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const router = useRouter();

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword) {
      // Call API or trigger reset password logic here
      router.push('/password-created');
      console.log("New Password:", newPassword);
      alert("Password reset successfully!");
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <AuthContainer imageSrc="/assets/set-new-password.svg">
      <AuthHeader
        logoClass="bg-[#C4C4C4]"
        heading="Setup New Password"
        subheading="Create a strong password to protect your account"
      />


      {/* New Password */}
      <div className="w-full mb-4">
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-[#666666]"
        >
          New Password
        </label>
        <InputField
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
      </div>

      {/* Confirm New Password */}
      <div className="w-full mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-[#666666]"
        >
          Re-Enter New Password
        </label>
        <InputField
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      <AuthButton text="Confirm" onClick={handleResetPassword} />

      <Link href="/login" className="text-md underline text-[#666666] mt-2">
        Back to Login
      </Link>
    </AuthContainer>
  );
}
