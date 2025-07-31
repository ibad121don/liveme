"use client";

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export default function ToggleSwitch({
  label,
  enabled,
  setEnabled,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between  px-4 py-2 rounded-md w-full text-sm">
      <span className="text-gray-800">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-[#1E3A8A]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
