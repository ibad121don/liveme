"use client";

import AuthContainer from "@/components/ui/AuthContainer";
import AuthButton from "@/components/ui/AuthButton";
import AuthHeader from "@/components/ui/AuthHeader"; // Import the new AuthHeader component
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PasswordCreated() {
    const router = useRouter();
  const handleBackToLogin = () => {
    router.push('/login')
  };

  return (
    <AuthContainer imageSrc="/assets/success.svg">
      <AuthHeader
        logoClass="bg-[#C4C4C4]"
        heading="Password Created Successfully"
        subheading="Your password has been successfully created"
      />

      {/* Confirmation Icon */}
      <div className="flex justify-center mb-4">
        <Image
          height={100}
          width={100}
          src={"/success-icon.svg"}
          alt="Login Image"
        />
      </div>

      {/* Button to go back to login */}
      <AuthButton text="Back to Login" onClick={handleBackToLogin} />

    </AuthContainer>
  );
}
