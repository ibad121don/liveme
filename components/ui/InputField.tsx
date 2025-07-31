import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface InputFieldProps {
  label: string;
  id: string;
  type?: string;
  name: string;
  required?: boolean;
  placeholder: string;
  value: string;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  showPasswordToggle?: boolean;
  onTogglePasswordVisibility?: () => void;
  maxLength?: number; // Added maxLength prop
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  onTogglePasswordVisibility,
  maxLength, // Destructuring the maxLength prop
}) => {
  return (
    <div className="w-full relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength} // Apply maxLength here
        className="w-full p-3 border border-[#66666659] rounded-lg"
      />
      {showPasswordToggle && (
        <span
          className="absolute right-3 top-3 cursor-pointer"
          onClick={onTogglePasswordVisibility}
        >
          {type === "password" ? (
            <AiOutlineEyeInvisible size={24} />
          ) : (
            <AiOutlineEye size={24} />
          )}
        </span>
      )}
    </div>
  );
};

export default InputField;
