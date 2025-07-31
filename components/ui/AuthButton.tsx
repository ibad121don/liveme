import React from "react";

interface AuthButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 bg-[#1E3A8A] hover:bg-[#172D6E] text-white rounded-full font-semibold"
    >
      {text}
    </button>
  );
};

export default AuthButton;
