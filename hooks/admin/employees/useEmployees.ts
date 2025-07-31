import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./employeeApi";
import { EmployeeRow } from "@/types/employee";

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const addEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const editEmployeeMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<EmployeeRow>;
    }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const removeEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    
    },
    
  });

  return {
    employees: data || [],
    isLoading,
    isError,
    addEmployee: addEmployeeMutation.mutate,
    editEmployee: editEmployeeMutation.mutate,
    deleteEmployee: removeEmployeeMutation.mutate,
  };
}
