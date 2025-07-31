import { EmployeeRow } from "@/types/employee";

const BASE_URL = "/api/admin/employees";

export const fetchEmployees = async (): Promise<EmployeeRow[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
};

export const createEmployee = async (
  data: Omit<EmployeeRow, "_id">
): Promise<EmployeeRow> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create employee");
  return res.json();
};

export const updateEmployee = async (
  id: string,
  data: Partial<EmployeeRow>
): Promise<EmployeeRow> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
};

export const deleteEmployee = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete employee");
  return res.json();
};
export type { EmployeeRow };

