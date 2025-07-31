import React, { ReactNode } from "react";
import Image from "next/image";

interface AuthContainerProps {
  children: ReactNode;
  imageSrc: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, imageSrc }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 justify-center h-screen px-4 lg:px-20">
      {/* Image will be hidden on small screens and shown on large screens */}
      <div className="w-full lg:w-1/2 hidden lg:block">
        <Image
          height={852}
          width={568}
          src={imageSrc}
          alt="Login Image"
          className="w-full h-auto"
        />
      </div>

      {/* Content (form, etc.) */}
      <div className="flex flex-col gap-4  items-center px-8 py-10 w-full max-w-md lg:w-1/2 bg-white text-[#333333] rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
