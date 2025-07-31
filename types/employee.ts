// types/employee.ts

export interface EmployeeRow {
  _id: string;
  name: string;
  email: string;
  role: "seller";
  paymentType: "Commission" | "Hourly" | "Salary";
  rate: string;
  status: "Active" | "Inactive";
  companyId: string;
}
