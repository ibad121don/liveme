// src/app/(auth)/login/page.tsx
"use client";

import { MouseEvent, useState } from "react";
import AuthContainer from "@/components/ui/AuthContainer";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import Link from "next/link";
import AuthHeader from "@/components/ui/AuthHeader";
import { useLogin } from "../../../hooks/authentication/useLogin"; // Import your custom hook

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"seller" | "admin" | "superadmin">(
    "seller"
  );

  const { mutate: loginUser, status, isError, error } = useLogin();
  const isLoading = status === "pending";

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(e.target.value as "seller" | "admin" | "superadmin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    loginUser({ email, password, userType });
  };

  return (
    <AuthContainer imageSrc="/assets/login-image.svg">
      <AuthHeader
        logoClass="bg-[#C4C4C4]"
        heading="Welcome"
        subheading="Enter your details to login to Live Commerce Pro"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-y-4"
      >
        {/* Radio Buttons */}
        <div className="w-full">
          <label className="block text-center text-sm text-[#666666] mb-2">
            Select Role
          </label>
          <div className="flex flex-wrap justify-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-[#333]">
              <input
                type="radio"
                name="userType"
                value="seller"
                checked={userType === "seller"}
                onChange={handleRadioChange}
                className="accent-[#1E3A8A]"
              />
              I am a Seller
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-[#333]">
              <input
                type="radio"
                name="userType"
                value="admin"
                checked={userType === "admin"}
                onChange={handleRadioChange}
                className="accent-[#1E3A8A]"
              />
              I am a Company Admin
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-[#333]">
              <input
                type="radio"
                name="userType"
                value="superadmin"
                checked={userType === "superadmin"}
                onChange={handleRadioChange}
                className="accent-[#1E3A8A]"
              />
              I am a Super Admin
            </label>
          </div>
        </div>

        {/* Email Input */}
        <div className="w-full">
          <label htmlFor="email" className="block text-sm mb-1 text-[#666666]">
            Email address
          </label>
          <InputField
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            label={""}
            name={""}
          />
        </div>

        {/* Password Input */}
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm mb-1 text-[#666666]"
          >
            Password
          </label>
          <InputField
            id="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            showPasswordToggle={true}
            onTogglePasswordVisibility={togglePasswordVisibility}
            label={""}
            name={""}
          />
        </div>

        {/* Error Message Display */}
        {isError && (
          <div className="text-red-500 text-sm mt-2">
            {error?.message || "An unexpected error occurred during login."}
          </div>
        )}

        {/* Login Button - Changed to type="submit" */}
        <AuthButton
          text={isLoading ? "Logging In..." : "Login"}
          disabled={isLoading}
        />
      </form>

      {/* Forgot Password */}
      <Link
        href="/forgot-password"
        className="text-md underline text-[#666666]"
      >
        Forgot Password?
      </Link>
    </AuthContainer>
  );
}
