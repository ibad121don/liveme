"use client";

import { useState } from "react";
import AuthContainer from "@/components/ui/AuthContainer";
import InputField from "@/components/ui/InputField";
import RadioButtonGroup from "@/components/ui/RadioButtonGroup";
import AuthButton from "@/components/ui/AuthButton";
import Link from "next/link";
import AuthHeader from "@/components/ui/AuthHeader";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("seller");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserType(e.target.value);
  };

  const router = useRouter();
  const handleSendOTP = () => {
    router.push('/otp')
  };

  const userTypeOptions = [
    { label: "I am a seller", value: "seller" },
    { label: "I am a Company Admin", value: "admin" },
  ];

  return (
    <AuthContainer imageSrc="/assets/forget-password-image.svg">
      <AuthHeader 
        logoClass="bg-[#C4C4C4]" 
        heading="Forgot Password?" 
        subheading="Enter the email account linked to your profile"
      />

      <RadioButtonGroup
        options={userTypeOptions}
        selectedValue={userType}
        onChange={handleRadioChange}
      />

      {/* Email input field with label */}
      <div className="w-full mb-4">
        <label
          htmlFor="email"
          className="block text-sm mb-1 text-[#666666]"
        >
          Email address
        </label>
        <InputField
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <AuthButton text="Send OTP" onClick={handleSendOTP} />

      <Link href="/login" className="text-md underline text-[#666666] mt-2">
        Back to Login
      </Link>
    </AuthContainer>
  );
}
