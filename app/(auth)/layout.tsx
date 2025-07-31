import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[url('/assets/auth-background.png')] bg-cover bg-center w-full h-screen bg-[#151D48] flex justify-center items-center">
      <div className="w-full h-screen bg-[#151d48f0] shadow-lg">
        {children}
      </div>
    </div>
  );
}
