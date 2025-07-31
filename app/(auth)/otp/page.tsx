'use client';

import { useState, useEffect } from "react";
import AuthContainer from "@/components/ui/AuthContainer";
import InputField from "@/components/ui/InputField";
import AuthButton from "@/components/ui/AuthButton";
import Link from "next/link"; // Import Link for routing
import AuthHeader from "@/components/ui/AuthHeader"; // Import the new AuthHeader component
import { useRouter } from "next/navigation";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(3); // Set the initial timer for 30 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
  }, [isTimerRunning, timeLeft]);

  const router = useRouter();
  const handleVerify = () => {
    // Logic to verify OTP
    router.push('/reset-password')
  };


  const handleResendOTP = () => {
    setIsTimerRunning(true);
    setTimeLeft(30); // Reset the timer
  };

  return (
    <AuthContainer imageSrc="/assets/otp.svg">
      <AuthHeader 
        logoClass="bg-[#C4C4C4]" 
        heading="Enter OTP" 
        subheading="Enter the 6-digit code sent to your email"
      />

      {/* OTP input field with label */}
      <div className="w-full mb-4">
        <label
          htmlFor="otp"
          className="block text-sm mb-1 text-[#666666]"
        >
          Enter OTP
        </label>
        <InputField
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
        />
      </div>

      {/* Timer */}
      <div className="text-sm text-[#666666] mt-2">
        {isTimerRunning ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : "Time's up!"}
      </div>

      {/* Verify Button */}
      <AuthButton text="Verify" onClick={handleVerify} />

      {/* Resend OTP Link */}
      {!isTimerRunning && (
        <Link href="#" onClick={handleResendOTP} className="text-md underline text-[#666666] mt-2">
          Didn’t receive the code?
        </Link>
      )}
    </AuthContainer>
  );
}
