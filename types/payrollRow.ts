// types/payrollRow.ts
export interface PayrollRow {
  _id: string;
  companyId: string;
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  type: "commission" | "hourly";
  rate: number;
  approvedSales: number;
  hoursWorked: number;
  totalPay: number;
  paymentType: string;
  hoursOrCommission: string;
}
interface PayrollTableRow {
  id: string;
  companyId: string;
  employee: string;
  paymentType: "Hourly" | "Commission";
  revenue: string;
  profit: string;
  hoursOrCommission: string;
  calculatedPay: string;
  dropdownActions: string[];
}
