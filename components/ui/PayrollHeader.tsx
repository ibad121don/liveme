"use client";
interface PayrollHeaderProps {
  totalEmployees: number;
}
export default function PayrollHeader({ totalEmployees }: PayrollHeaderProps) {
  return (
    <div className="flex justify-between items-start sm:items-center w-full bg-[#F9FAFB] py-4 px-2 sm:px-4 flex-col sm:flex-row">
      <h1 className="text-xl sm:text-2xl font-bold text-[#0B0B58]">
        Manage Payrolls
      </h1>

      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <div className="bg-[#DCFCE7] text-[#15803D] rounded-md px-4 py-2 text-sm font-medium">
          {totalEmployees} Active Employees
        </div>
        <div className="bg-[#FFE4E6] text-[#BE123C] rounded-md px-4 py-2 text-sm font-medium">
          $0k Total Payroll
        </div>
      </div>
    </div>
  );
}
