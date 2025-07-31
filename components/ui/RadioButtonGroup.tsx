interface RadioButtonGroupProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ options, selectedValue, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row  md:gap-6 mb-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center">
          <input
            type="radio"
            name="userType"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
