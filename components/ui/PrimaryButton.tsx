import React from "react";

interface PrimaryButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 bg-[#1E3A8A] text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md hover:bg-[#1A2E85] transition-all duration-200 ${className}`}
    >
      {icon}
      <span className="whitespace-nowrap">{text}</span>
    </button>
  );
};

export default PrimaryButton;
